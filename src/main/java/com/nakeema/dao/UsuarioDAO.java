package com.nakeema.dao;

import com.nakeema.connection.ConnectionDB; // Asegúrate de que este nombre sea igual a tu clase de conexión
import com.nakeema.modelo.Usuario;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class UsuarioDAO {

    // 1. LOGIN
    public Usuario validarLogin(String identificador, String password, String rol) {
        String sql = "SELECT * FROM usuarios WHERE (username = ? OR email = ?) AND password = ? AND rol = ?";

        try (Connection con = ConnectionDB.obtenerConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setString(1, identificador);
            ps.setString(2, identificador);
            ps.setString(3, password);
            ps.setString(4, rol);

            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return new Usuario(
                            rs.getInt("id"),
                            rs.getString("username"),
                            rs.getString("email"),
                            rs.getString("password"),
                            rs.getString("rol")
                    );
                }
            }
        } catch (SQLException e) {
            System.out.println("Error en login: " + e.getMessage());
        }
        return null;
    }

    // 2. CREATE (Registrar)
    public boolean insertar(Usuario usuario) {
        String sql = "INSERT INTO usuarios (username, email, password, rol) VALUES (?, ?, ?, ?)";
        try (Connection con = ConnectionDB.obtenerConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setString(1, usuario.getUsername());
            ps.setString(2, usuario.getEmail());
            ps.setString(3, usuario.getPassword());
            ps.setString(4, usuario.getRol());

            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            System.out.println("Error al registrar: " + e.getMessage());
            return false;
        }
    }

    // 3. UPDATE (Actualizar)
    public boolean actualizarUsuario(Usuario usuario) {
        String sql = "UPDATE usuarios SET username = ?, email = ?, password = ?, rol = ? WHERE id = ?";
        try (Connection con = ConnectionDB.obtenerConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setString(1, usuario.getUsername());
            ps.setString(2, usuario.getEmail());
            ps.setString(3, usuario.getPassword());
            ps.setString(4, usuario.getRol());
            ps.setInt(5, usuario.getId());

            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            System.out.println("Error al actualizar: " + e.getMessage());
            return false;
        }
    }

    // 4. DELETE (Eliminar)
    public boolean eliminarUsuario(int id) {
        String sql = "DELETE FROM usuarios WHERE id = ?";
        try (Connection con = ConnectionDB.obtenerConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setInt(1, id);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            System.out.println("Error al eliminar: " + e.getMessage());
            return false;
        }
    }
}