<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@include file= "../templates/header.jsp" %>

<!--<script>

    $(document).ready(function(){
    
    $.ajax({
        type: "POST",
        url: "/barterserver/user/post/save",
        data: {'user.name':"Guilherme",'user.email':"gnmfcastro@gmail.com",'user.password':"123456",'user.age':22},
        dataType: "json", 
        success: null
      });
      
    });
    
</script>-->

<h1>Users</h1>

<table>
    <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Email</th>
        <th>Age</th>
    </tr>
    <c:forEach items="${users}" var="user">
        <tr>
           <td>${user.id}</td>
           <td>${user.name}</td>
           <td>${user.email}</td>
           <td>${user.age}</td>
        </tr>
    </c:forEach>
    
</table>

<%@include file="../templates/footer.jsp" %>
