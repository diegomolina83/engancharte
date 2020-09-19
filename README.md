# App de compra/venta de obras de arte

## Routes

 Method |Path | Descripction 
--- | --- | ---
GET| / | Índice
GET| /tags/:id |  Busqueda de cuadro según el tag
GET| /login | Registro 
POST| /login | Registro
GET | /signup | Iniciar sesión 
POST| /signup | Iniciar sesión 
GET | /logout | Cerrar sesión
GET | /user | Perfil usuario
POST | /user/edit | Editar perfil de usuario
GET | /user/delete/:id | Borrar perfil de usuario
GET | /user/works | Ver obras de usuario  
POST | /user/works/edit | Editar una obra de usuario 
GET | /user/works/delete/:id | Eliminar una obra de usuario
GET | /shop | Ir al carrito 
POST | /shop | Comprar obra
GET | /shop/delete | Eliminar obra del carrito
GET | /show-gallerys | Mostrar en el mapa galerias cercanas
