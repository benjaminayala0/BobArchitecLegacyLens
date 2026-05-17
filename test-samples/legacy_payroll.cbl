       IDENTIFICATION DIVISION.
       PROGRAM-ID. PAYROLL-SYSTEM.
       AUTHOR. J. SMITH.
       DATE-WRITTEN. 1985-04-12.
       REMARKS. THIS PROGRAM CALCULATES WEEKLY PAYROLL.
       *=============================================================*
       * MODIFICATION HISTORY:
       * 1990-01-10: ADDED Y2K FIX (K. JOHNSON)
       * 1995-11-22: HACK TO FIX OVERTIME BUG - DO NOT TOUCH!
       * 2003-05-14: INCREASED ARRAY SIZE
       *=============================================================*

       ENVIRONMENT DIVISION.
       INPUT-OUTPUT SECTION.
       FILE-CONTROL.
           SELECT EMPLOYEE-FILE ASSIGN TO "EMP.DAT"
               ORGANIZATION IS LINE SEQUENTIAL.
           SELECT TIME-CARD-FILE ASSIGN TO "TIMECARD.DAT"
               ORGANIZATION IS LINE SEQUENTIAL.
           SELECT PAYROLL-REPORT ASSIGN TO "PAYROLL.RPT"
               ORGANIZATION IS LINE SEQUENTIAL.

       DATA DIVISION.
       FILE SECTION.
       FD  EMPLOYEE-FILE.
       01  EMP-RECORD.
           05 EMP-ID           PIC X(5).
           05 EMP-NAME         PIC X(25).
           05 EMP-DEPT         PIC X(3).
           05 EMP-HOURLY-RATE  PIC 9(3)V99.
           05 EMP-TAX-CODE     PIC X(1).
           05 EMP-STATUS       PIC X(1).

       FD  TIME-CARD-FILE.
       01  TIME-RECORD.
           05 TC-EMP-ID        PIC X(5).
           05 TC-HOURS-WORKED  PIC 9(2)V99.
           05 TC-WEEK-ENDING   PIC 9(8).

       FD  PAYROLL-REPORT.
       01  REPORT-LINE         PIC X(80).

       WORKING-STORAGE SECTION.
       01  WS-EOF-FLAGS.
           05 WS-EMP-EOF       PIC X VALUE 'N'.
           05 WS-TC-EOF        PIC X VALUE 'N'.

       01  WS-CALCULATIONS.
           05 WS-REGULAR-PAY   PIC 9(5)V99 VALUE ZERO.
           05 WS-OVERTIME-PAY  PIC 9(5)V99 VALUE ZERO.
           05 WS-GROSS-PAY     PIC 9(5)V99 VALUE ZERO.
           05 WS-TAX-DEDUCT    PIC 9(5)V99 VALUE ZERO.
           05 WS-NET-PAY       PIC 9(5)V99 VALUE ZERO.
           05 WS-OT-HOURS      PIC 9(2)V99 VALUE ZERO.
           05 WS-REG-HOURS     PIC 9(2)V99 VALUE ZERO.

       01  WS-TOTALS.
           05 WS-TOT-GROSS     PIC 9(7)V99 VALUE ZERO.
           05 WS-TOT-NET       PIC 9(7)V99 VALUE ZERO.
           05 WS-EMP-COUNT     PIC 9(4) VALUE ZERO.

       01  WS-REPORT-HEADERS.
           05 HEADER-1.
              10 FILLER        PIC X(20) VALUE "COMPANY PAYROLL REP".
              10 FILLER        PIC X(60) VALUE "ORT".
           05 HEADER-2.
              10 FILLER        PIC X(10) VALUE "EMP ID".
              10 FILLER        PIC X(20) VALUE "NAME".
              10 FILLER        PIC X(10) VALUE "GROSS".
              10 FILLER        PIC X(10) VALUE "TAXES".
              10 FILLER        PIC X(10) VALUE "NET PAY".

       01  WS-DETAIL-LINE.
           05 DL-EMP-ID        PIC X(5).
           05 FILLER           PIC X(5) VALUE SPACES.
           05 DL-EMP-NAME      PIC X(20).
           05 DL-GROSS-PAY     PIC $$$$,$$9.99.
           05 FILLER           PIC X(2) VALUE SPACES.
           05 DL-TAX-DEDUCT    PIC $$$$,$$9.99.
           05 FILLER           PIC X(2) VALUE SPACES.
           05 DL-NET-PAY       PIC $$$$,$$9.99.

       PROCEDURE DIVISION.
       0000-MAIN-LOGIC.
           PERFORM 1000-INITIALIZATION.
           PERFORM 2000-PROCESS-RECORDS UNTIL WS-TC-EOF = 'Y'.
           PERFORM 3000-TERMINATION.
           STOP RUN.

       1000-INITIALIZATION.
           OPEN INPUT EMPLOYEE-FILE.
           OPEN INPUT TIME-CARD-FILE.
           OPEN OUTPUT PAYROLL-REPORT.
           
           WRITE REPORT-LINE FROM HEADER-1.
           WRITE REPORT-LINE FROM HEADER-2.
           
           READ TIME-CARD-FILE
               AT END MOVE 'Y' TO WS-TC-EOF.

       2000-PROCESS-RECORDS.
           MOVE 'N' TO WS-EMP-EOF.
           
           * FIND MATCHING EMPLOYEE (LINEAR SEARCH - VERY INEFFICIENT!)
           PERFORM 2100-FIND-EMPLOYEE UNTIL WS-EMP-EOF = 'Y' 
                                         OR EMP-ID = TC-EMP-ID.
           
           IF EMP-ID = TC-EMP-ID
               PERFORM 2200-CALCULATE-PAY
               PERFORM 2300-PRINT-DETAIL
           ELSE
               DISPLAY "ERROR: NO EMPLOYEE FOUND FOR ID " TC-EMP-ID
           END-IF.
           
           * RESET EMPLOYEE FILE FOR NEXT TIME CARD
           CLOSE EMPLOYEE-FILE.
           OPEN INPUT EMPLOYEE-FILE.
           
           READ TIME-CARD-FILE
               AT END MOVE 'Y' TO WS-TC-EOF.

       2100-FIND-EMPLOYEE.
           READ EMPLOYEE-FILE
               AT END MOVE 'Y' TO WS-EMP-EOF.

       2200-CALCULATE-PAY.
           MOVE ZERO TO WS-REGULAR-PAY WS-OVERTIME-PAY WS-GROSS-PAY.
           
           IF TC-HOURS-WORKED > 40
               MOVE 40 TO WS-REG-HOURS
               SUBTRACT 40 FROM TC-HOURS-WORKED GIVING WS-OT-HOURS
               
               MULTIPLY WS-REG-HOURS BY EMP-HOURLY-RATE 
                   GIVING WS-REGULAR-PAY
                   
               MULTIPLY WS-OT-HOURS BY EMP-HOURLY-RATE 
                   GIVING WS-OVERTIME-PAY
               MULTIPLY WS-OVERTIME-PAY BY 1.5 
                   GIVING WS-OVERTIME-PAY
           ELSE
               MOVE TC-HOURS-WORKED TO WS-REG-HOURS
               MULTIPLY WS-REG-HOURS BY EMP-HOURLY-RATE 
                   GIVING WS-REGULAR-PAY
               MOVE ZERO TO WS-OVERTIME-PAY
           END-IF.
           
           ADD WS-REGULAR-PAY WS-OVERTIME-PAY GIVING WS-GROSS-PAY.
           
           * HACKY TAX CALCULATION
           IF EMP-TAX-CODE = 'A'
               MULTIPLY WS-GROSS-PAY BY 0.15 GIVING WS-TAX-DEDUCT
           ELSE IF EMP-TAX-CODE = 'B'
               MULTIPLY WS-GROSS-PAY BY 0.20 GIVING WS-TAX-DEDUCT
           ELSE
               MULTIPLY WS-GROSS-PAY BY 0.25 GIVING WS-TAX-DEDUCT
           END-IF.
           
           SUBTRACT WS-TAX-DEDUCT FROM WS-GROSS-PAY GIVING WS-NET-PAY.
           
           ADD WS-GROSS-PAY TO WS-TOT-GROSS.
           ADD WS-NET-PAY TO WS-TOT-NET.
           ADD 1 TO WS-EMP-COUNT.

       2300-PRINT-DETAIL.
           MOVE EMP-ID TO DL-EMP-ID.
           MOVE EMP-NAME TO DL-EMP-NAME.
           MOVE WS-GROSS-PAY TO DL-GROSS-PAY.
           MOVE WS-TAX-DEDUCT TO DL-TAX-DEDUCT.
           MOVE WS-NET-PAY TO DL-NET-PAY.
           
           WRITE REPORT-LINE FROM WS-DETAIL-LINE.

       3000-TERMINATION.
           DISPLAY "TOTAL EMPLOYEES: " WS-EMP-COUNT.
           CLOSE EMPLOYEE-FILE.
           CLOSE TIME-CARD-FILE.
           CLOSE PAYROLL-REPORT.
