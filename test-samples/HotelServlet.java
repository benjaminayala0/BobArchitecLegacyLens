import java.sql.*;
import java.util.*;
import javax.servlet.*;
import javax.servlet.http.*;
import java.io.*;
import javax.mail.*;
import javax.mail.internet.*;

/**
 * HotelServlet.java
 * Written in 2008. Handles ALL hotel operations in a single servlet.
 * WARNING: This is intentional legacy spaghetti for testing BobArchitecLegacyLens.
 */
public class HotelServlet extends HttpServlet {

    static Connection conn;
    static final String DB_URL = "jdbc:mysql://localhost:3306/hotel_legacy";
    static final String DB_USER = "root";
    static final String DB_PASS = "admin123"; // hardcoded password

    static {
        try {
            Class.forName("com.mysql.jdbc.Driver");
            conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASS);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String action = request.getParameter("action");
        PrintWriter out = response.getWriter();
        response.setContentType("text/html");

        try {
            if ("book_room".equals(action)) {
                String guestName = request.getParameter("guest_name");
                String guestEmail = request.getParameter("email");
                String guestPhone = request.getParameter("phone");
                String idNumber = request.getParameter("id_number");
                String roomType = request.getParameter("room_type"); // single, double, suite
                String checkIn = request.getParameter("check_in");
                String checkOut = request.getParameter("check_out");
                int numGuests = Integer.parseInt(request.getParameter("num_guests"));

                // Register guest if not exists (mixed with booking logic)
                Statement stmt = conn.createStatement();
                ResultSet rs = stmt.executeQuery("SELECT id FROM guests WHERE id_number = '" + idNumber + "'");
                int guestId;
                if (rs.next()) {
                    guestId = rs.getInt("id");
                    // Update contact info every time (bad practice)
                    stmt.executeUpdate("UPDATE guests SET phone = '" + guestPhone + "', email = '" + guestEmail + "' WHERE id = " + guestId);
                } else {
                    stmt.executeUpdate("INSERT INTO guests (full_name, email, phone, id_number, registration_date, vip_status) VALUES ('" + guestName + "', '" + guestEmail + "', '" + guestPhone + "', '" + idNumber + "', NOW(), 0)");
                    rs = stmt.executeQuery("SELECT LAST_INSERT_ID()");
                    rs.next();
                    guestId = rs.getInt(1);
                }

                // Find available room (inline query, no repository)
                rs = stmt.executeQuery("SELECT id, price_per_night FROM rooms WHERE room_type = '" + roomType + "' AND status = 'available' LIMIT 1");
                if (!rs.next()) {
                    out.println("<h2>No rooms available for type: " + roomType + "</h2>");
                    return;
                }
                int roomId = rs.getInt("id");
                double pricePerNight = rs.getDouble("price_per_night");

                // Calculate total cost inline
                long diffMillis = java.sql.Date.valueOf(checkOut).getTime() - java.sql.Date.valueOf(checkIn).getTime();
                int nights = (int) (diffMillis / (1000 * 60 * 60 * 24));
                double totalCost = pricePerNight * nights;

                // Apply discounts inline (should be a strategy)
                if (nights >= 7) {
                    totalCost *= 0.85; // 15% weekly discount
                } else if (nights >= 3) {
                    totalCost *= 0.95; // 5% multi-night discount
                }

                // Check VIP status for extra discount
                rs = stmt.executeQuery("SELECT vip_status FROM guests WHERE id = " + guestId);
                if (rs.next() && rs.getInt("vip_status") == 1) {
                    totalCost *= 0.90; // 10% VIP discount
                }

                // Tax calculation
                double tax = totalCost * 0.18;
                double grandTotal = totalCost + tax;

                // Create booking
                stmt.executeUpdate("INSERT INTO bookings (guest_id, room_id, check_in, check_out, num_guests, total_cost, tax, status, created_at) VALUES (" + guestId + ", " + roomId + ", '" + checkIn + "', '" + checkOut + "', " + numGuests + ", " + grandTotal + ", " + tax + ", 'confirmed', NOW())");

                // Update room status
                stmt.executeUpdate("UPDATE rooms SET status = 'occupied' WHERE id = " + roomId);

                // Send confirmation email (mixed with booking logic)
                try {
                    Properties props = new Properties();
                    props.put("mail.smtp.host", "smtp.hotel.com");
                    Session session = Session.getDefaultInstance(props);
                    MimeMessage msg = new MimeMessage(session);
                    msg.setFrom(new InternetAddress("reservations@hotel.com"));
                    msg.addRecipient(Message.RecipientType.TO, new InternetAddress(guestEmail));
                    msg.setSubject("Booking Confirmation");
                    msg.setText("Dear " + guestName + ", your booking is confirmed. Room: " + roomId + ", Check-in: " + checkIn + ", Total: $" + grandTotal);
                    Transport.send(msg);
                } catch (Exception emailEx) {
                    // ignore email errors
                }

                out.println("<h2>Booking confirmed! Total: $" + String.format("%.2f", grandTotal) + "</h2>");

            } else if ("checkout".equals(action)) {
                int bookingId = Integer.parseInt(request.getParameter("booking_id"));
                Statement stmt = conn.createStatement();

                // Get booking details
                ResultSet rs = stmt.executeQuery("SELECT b.room_id, b.guest_id, b.total_cost, r.room_type FROM bookings b JOIN rooms r ON b.room_id = r.id WHERE b.id = " + bookingId);
                if (rs.next()) {
                    int roomId = rs.getInt("room_id");
                    int guestId = rs.getInt("guest_id");
                    double totalCost = rs.getDouble("total_cost");

                    // Mark room as available
                    stmt.executeUpdate("UPDATE rooms SET status = 'needs_cleaning' WHERE id = " + roomId);
                    stmt.executeUpdate("UPDATE bookings SET status = 'checked_out', checkout_time = NOW() WHERE id = " + bookingId);

                    // Create invoice inline
                    stmt.executeUpdate("INSERT INTO invoices (booking_id, guest_id, amount, invoice_date, payment_status) VALUES (" + bookingId + ", " + guestId + ", " + totalCost + ", NOW(), 'pending')");

                    // Check total stays for VIP upgrade
                    rs = stmt.executeQuery("SELECT COUNT(*) as total_stays FROM bookings WHERE guest_id = " + guestId + " AND status = 'checked_out'");
                    if (rs.next() && rs.getInt("total_stays") >= 10) {
                        stmt.executeUpdate("UPDATE guests SET vip_status = 1 WHERE id = " + guestId);
                    }

                    out.println("<h2>Checkout complete for booking #" + bookingId + "</h2>");
                }

            } else if ("report".equals(action)) {
                String reportType = request.getParameter("report_type");
                Statement stmt = conn.createStatement();

                if ("revenue".equals(reportType)) {
                    ResultSet rs = stmt.executeQuery("SELECT DATE(b.created_at) as booking_date, SUM(b.total_cost) as daily_revenue, COUNT(*) as num_bookings FROM bookings b WHERE b.status != 'cancelled' GROUP BY DATE(b.created_at) ORDER BY booking_date DESC LIMIT 30");
                    out.println("<table border='1'><tr><th>Date</th><th>Revenue</th><th>Bookings</th></tr>");
                    while (rs.next()) {
                        out.println("<tr><td>" + rs.getString("booking_date") + "</td><td>$" + rs.getDouble("daily_revenue") + "</td><td>" + rs.getInt("num_bookings") + "</td></tr>");
                    }
                    out.println("</table>");
                } else if ("occupancy".equals(reportType)) {
                    ResultSet rs = stmt.executeQuery("SELECT room_type, COUNT(*) as total, SUM(CASE WHEN status = 'occupied' THEN 1 ELSE 0 END) as occupied FROM rooms GROUP BY room_type");
                    out.println("<table border='1'><tr><th>Type</th><th>Total</th><th>Occupied</th><th>Rate</th></tr>");
                    while (rs.next()) {
                        int total = rs.getInt("total");
                        int occupied = rs.getInt("occupied");
                        double rate = (total > 0) ? ((double) occupied / total * 100) : 0;
                        out.println("<tr><td>" + rs.getString("room_type") + "</td><td>" + total + "</td><td>" + occupied + "</td><td>" + String.format("%.1f", rate) + "%</td></tr>");
                    }
                    out.println("</table>");
                }
            }
        } catch (SQLException e) {
            out.println("<h2>Database Error: " + e.getMessage() + "</h2>");
            e.printStackTrace();
        }
    }
}
