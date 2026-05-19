<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
  <title>Registro Nakeema</title>
</head>
<body>
<h2>Registrar Usuario</h2>
<form action="<%= request.getContextPath() %>/registro" method="POST">
  Username: <input type="text" name="username" required><br>
  Email: <input type="email" name="email" required><br>
  Password: <input type="password" name="password" required><br>
  Rol: <input type="text" name="rol" required><br>
  <button type="submit">Registrar</button>
</form>
</body>
</html>