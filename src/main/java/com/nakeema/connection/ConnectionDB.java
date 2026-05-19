package com.nakeema.connection;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class ConnectionDB {
    private static final String URL = "jdbc:mysql://localhost:3306/nakeemadb";
    private static final String USER = "root";
    private static final String PASSWORD = "";

    public static Connection obtenerConnection() {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            return DriverManager.getConnection(URL, USER, PASSWORD);
        } catch (Exception e) {
            System.err.println("❌ ERROR DE CONEXIÓN SQL: " + e.getMessage());
            return null;
        }
    }
}