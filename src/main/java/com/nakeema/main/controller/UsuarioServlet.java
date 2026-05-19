package com.nakeema.controller;

import com.nakeema.dao.UsuarioDAO;
import com.nakeema.modelo.Usuario;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import jakarta.servlet.annotation.*;
import java.io.IOException;

@WebServlet(name = "UsuarioServlet", urlPatterns = {"/registro"})
public class UsuarioServlet extends HttpServlet {

    private UsuarioDAO usuarioDAO = new UsuarioDAO();

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        // 1. Recibimos los datos del formulario
        String user = request.getParameter("username");
        String email = request.getParameter("email");
        String pass = request.getParameter("password");
        String rol = request.getParameter("rol");

        // 2. Creamos el objeto Usuario (ID 0 porque la BD lo pone automático)
        Usuario nuevoUsuario = new Usuario(0, user, email, pass, rol);

        // 3. Usamos el DAO para guardar en la base de datos
        boolean guardado = usuarioDAO.insertar(nuevoUsuario);

        // 4. Respondemos al usuario
        response.setContentType("text/html");
        if (guardado) {
            response.getWriter().println("<h1>Usuario registrado exitosamente</h1><a href='index.jsp'>Volver</a>");
        } else {
            response.getWriter().println("<h1>Error al registrar</h1><a href='index.jsp'>Volver</a>");
        }
    }
}