"""
legacy_school_system.py
A horrifying school management system written by an intern in 2012.
All logic in one file, global variables, SQL injection, no ORM, mixed concerns.
"""

import sqlite3
import smtplib
import os

db = sqlite3.connect("school.db")
cursor = db.cursor()

# Create tables inline, no migrations
cursor.execute("CREATE TABLE IF NOT EXISTS students (id INTEGER PRIMARY KEY, name TEXT, email TEXT, grade TEXT, parent_phone TEXT, enrollment_date TEXT, is_active INTEGER DEFAULT 1)")
cursor.execute("CREATE TABLE IF NOT EXISTS teachers (id INTEGER PRIMARY KEY, full_name TEXT, subject TEXT, salary REAL, hire_date TEXT)")
cursor.execute("CREATE TABLE IF NOT EXISTS courses (id INTEGER PRIMARY KEY, course_name TEXT, teacher_id INTEGER, room TEXT, schedule TEXT, max_students INTEGER)")
cursor.execute("CREATE TABLE IF NOT EXISTS enrollments (id INTEGER PRIMARY KEY, student_id INTEGER, course_id INTEGER, enrollment_date TEXT, final_grade REAL, status TEXT DEFAULT 'active')")
cursor.execute("CREATE TABLE IF NOT EXISTS payments (id INTEGER PRIMARY KEY, student_id INTEGER, amount REAL, payment_date TEXT, method TEXT, description TEXT, is_refunded INTEGER DEFAULT 0)")

def handle_request(action, data):
    global db, cursor

    if action == "register_student":
        name = data["name"]
        email = data["email"]
        grade = data["grade"]
        phone = data["parent_phone"]
        # SQL injection vulnerability
        cursor.execute(f"INSERT INTO students (name, email, grade, parent_phone, enrollment_date) VALUES ('{name}', '{email}', '{grade}', '{phone}', datetime('now'))")
        db.commit()
        student_id = cursor.lastrowid

        # Send welcome email mixed with business logic
        try:
            server = smtplib.SMTP("smtp.school.com", 587)
            server.login("admin@school.com", "password123")  # hardcoded credentials
            server.sendmail("admin@school.com", email, f"Welcome {name}! Your student ID is {student_id}")
            server.quit()
        except:
            pass  # silently ignore email errors

        # Auto-enroll in mandatory courses
        cursor.execute("SELECT id FROM courses WHERE course_name IN ('Math 101', 'English 101', 'PE')")
        mandatory = cursor.fetchall()
        for course in mandatory:
            cursor.execute(f"INSERT INTO enrollments (student_id, course_id, enrollment_date) VALUES ({student_id}, {course[0]}, datetime('now'))")
        db.commit()

        # Generate invoice mixed with registration
        tuition = 1500.00
        if grade in ["11", "12"]:
            tuition = 1800.00  # senior surcharge
        cursor.execute(f"INSERT INTO payments (student_id, amount, payment_date, method, description) VALUES ({student_id}, {tuition}, datetime('now'), 'pending', 'Annual tuition')")
        db.commit()

        print(f"Student {name} registered with ID {student_id}")

    elif action == "assign_teacher":
        teacher_name = data["name"]
        subject = data["subject"]
        salary = data["salary"]
        cursor.execute(f"INSERT INTO teachers (full_name, subject, salary, hire_date) VALUES ('{teacher_name}', '{subject}', {salary}, datetime('now'))")
        db.commit()

        # Also create a course for them immediately (bad coupling)
        room = f"Room-{cursor.lastrowid}"
        cursor.execute(f"INSERT INTO courses (course_name, teacher_id, room, schedule, max_students) VALUES ('{subject}', {cursor.lastrowid}, '{room}', 'MWF 9:00-10:30', 30)")
        db.commit()
        print(f"Teacher {teacher_name} assigned to {subject}")

    elif action == "grade_student":
        student_id = data["student_id"]
        course_id = data["course_id"]
        grade = data["grade"]
        cursor.execute(f"UPDATE enrollments SET final_grade = {grade}, status = 'completed' WHERE student_id = {student_id} AND course_id = {course_id}")
        db.commit()

        # Check if student passes - mixed with grading logic
        if float(grade) < 60:
            cursor.execute(f"UPDATE enrollments SET status = 'failed' WHERE student_id = {student_id} AND course_id = {course_id}")
            db.commit()
            # Get student email to notify failure
            cursor.execute(f"SELECT email, name FROM students WHERE id = {student_id}")
            row = cursor.fetchone()
            if row:
                try:
                    server = smtplib.SMTP("smtp.school.com", 587)
                    server.login("admin@school.com", "password123")
                    server.sendmail("admin@school.com", row[0], f"Dear {row[1]}, you failed the course. Please re-enroll.")
                    server.quit()
                except:
                    pass

    elif action == "generate_report_card":
        student_id = data["student_id"]
        cursor.execute(f"""
            SELECT s.name, s.grade, c.course_name, t.full_name, e.final_grade, e.status
            FROM students s
            JOIN enrollments e ON s.id = e.student_id
            JOIN courses c ON e.course_id = c.id
            JOIN teachers t ON c.teacher_id = t.id
            WHERE s.id = {student_id} AND s.is_active = 1
        """)
        rows = cursor.fetchall()

        # Generate HTML report inline (presentation mixed with data)
        html = "<html><body><h1>Report Card</h1><table border='1'>"
        html += "<tr><th>Course</th><th>Teacher</th><th>Grade</th><th>Status</th></tr>"
        total_grade = 0
        count = 0
        for row in rows:
            html += f"<tr><td>{row[2]}</td><td>{row[3]}</td><td>{row[4]}</td><td>{row[5]}</td></tr>"
            if row[4]:
                total_grade += row[4]
                count += 1
        avg = total_grade / count if count > 0 else 0
        html += f"</table><p>Average: {avg:.2f}</p></body></html>"

        # Write to file (file I/O mixed with business logic)
        with open(f"report_{student_id}.html", "w") as f:
            f.write(html)
        print(f"Report card saved for student {student_id}")

    elif action == "process_payment":
        student_id = data["student_id"]
        amount = data["amount"]
        method = data["method"]  # "cash", "card", "transfer"

        # Different processing per method (should be strategy pattern)
        if method == "card":
            # Fake card processing
            card_fee = amount * 0.029
            amount = amount + card_fee
        elif method == "transfer":
            # Bank transfer discount
            amount = amount * 0.95

        cursor.execute(f"INSERT INTO payments (student_id, amount, payment_date, method, description) VALUES ({student_id}, {amount}, datetime('now'), '{method}', 'Payment received')")
        db.commit()

        # Check if student has outstanding balance
        cursor.execute(f"SELECT SUM(amount) FROM payments WHERE student_id = {student_id} AND is_refunded = 0")
        total_paid = cursor.fetchone()[0] or 0
        cursor.execute(f"SELECT grade FROM students WHERE id = {student_id}")
        grade = cursor.fetchone()[0]
        required = 1500.00 if grade not in ["11", "12"] else 1800.00

        if total_paid >= required:
            print(f"Student {student_id} is fully paid")
        else:
            print(f"Student {student_id} still owes {required - total_paid}")

# Main execution
if __name__ == "__main__":
    import sys
    action = sys.argv[1] if len(sys.argv) > 1 else "register_student"
    handle_request(action, {"name": "John", "email": "john@test.com", "grade": "10", "parent_phone": "555-1234"})
