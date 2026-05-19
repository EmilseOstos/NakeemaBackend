package com.nakeema.main;

import com.nakeema.connection.ConnectionDB;
import com.nakeema.dao.UsuarioDAO;
import com.nakeema.modelo.Usuario;
import java.sql.Connection;

public class Main {
  public static void main(String[] args) {
    System.out.println("Iniciando aplicación Backend Nakeema...");
    Connection con = ConnectionDB.obtenerConnection();

    if (con != null) {
      UsuarioDAO usuarioDAO = new UsuarioDAO();

      System.out.println("\n========================================");
      System.out.println("     EJECUCIÓN DE PRUEBAS CRUD COMPLETO ");
      System.out.println("========================================");

      // 1. PRUEBA DE CREACIÓN (CREATE)
      System.out.println("\n[1] Probando CREATE (Insertar usuario de prueba)...");
      Usuario nuevoUsuario = new Usuario(0, "tecnico_sena", "sena_prueba@nakeema.com", "claveSena2026", "tech");
      boolean registrado = usuarioDAO.insertar(nuevoUsuario);
      System.out.println(registrado ? "-> ÉXITO: ¡Usuario registrado correctamente en MySQL!" : "-> ERROR: No se pudo registrar.");

      // 2. PRUEBA DE LECTURA / LOGIN (READ)
      System.out.println("\n[2] Probando READ (Validar Login del usuario creado)...");
      Usuario usuarioVerificado = usuarioDAO.validarLogin("sena_prueba@nakeema.com", "claveSena2026", "tech");
      if (usuarioVerificado != null) {
        System.out.println("-> ÉXITO: ¡Autenticación correcta! ID generado en BD: " + usuarioVerificado.getId());
        System.out.println("   Usuario: " + usuarioVerificado.getUsername() + " | Rol: " + usuarioVerificado.getRol().toUpperCase());

        // 3. PRUEBA DE ACTUALIZACIÓN (UPDATE)
        System.out.println("\n[3] Probando UPDATE (Modificar credenciales del usuario)...");
        usuarioVerificado.setUsername("tecnico_sena_actualizado");
        usuarioVerificado.setPassword("nuevaClaveSegura");
        boolean actualizado = usuarioDAO.actualizarUsuario(usuarioVerificado);
        System.out.println(actualizado ? "-> ÉXITO: ¡Registro actualizado en la base de datos!" : "-> ERROR: No se pudo actualizar.");

        // 4. PRUEBA DE ELIMINACIÓN (DELETE)
        System.out.println("\n[4] Probando DELETE (Eliminar registro de prueba)...");
        boolean eliminado = usuarioDAO.eliminarUsuario(usuarioVerificado.getId());
        System.out.println(eliminado ? "-> ÉXITO: ¡Usuario eliminado para limpiar la base de datos!" : "-> ERROR: No se pudo eliminar.");
      } else {
        System.out.println("-> ERROR CRÍTICO: No se pudo leer el usuario. Abortando pruebas de Update y Delete.");
      }

      System.out.println("\n========================================");
      System.out.println("       FIN DE LAS PRUEBAS DEL CRUD      ");
      System.out.println("========================================");
    }
  }
}