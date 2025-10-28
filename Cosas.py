#llave ssh
#ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAII5+SQPKJT6AZJO76suIiNFWTByLoxCK+XnKjR9hWs9G di.peguero@duocuc.cl
#npm install --save-dev karma-webpack webpack webpack-cli babel-loader @babel/core @babel/preset-env
#npm install --save-dev karma-webpack webpack webpack-cli babel-loader @babel/core @babel/preset-env
# Remove-Item -Recurse -Force node_modules, package-lock.json
#Remove-Item -Recurse -Force "C:\Users\yojan\AppData\Local\Temp\_karma_webpack_*"
#npm install --save-dev @babel/core babel-loader @babel/preset-env @babel/preset-react
#http://ec2-35-172-193-6.compute-1.amazonaws.com:3000/


#Archivo	Nº Tests
#LoginPage.test.js	= 2
#SubastasPage.test.js =	2
#EnvioPage.test.js = 1
#ProductoCard.test.js =	2
#ModalEnvio.test.js	= 3

#Archivo de test	        Usa mocks	Qué simula
#Navbar.test.js	            ✅ Sí	useNavigate, window.confirm
#ModalEnvio.test.js	        ✅ Sí	onDireccionChange, onGuardar
#ModalReclamar.test.js	    ✅ Sí	onReclamar, onCerrar
#LoginPage.test.js	        ❌ No	Solo renderizado
#SubastasPage.test.js	    ❌ No	Solo texto en pantalla
#EnvioPage.test.js	        ❌ No	Mensaje sin productos
#ProductoCard.test.js	    ✅ Sí	onPujar
#Footer.test.js	            ❌ No	Renderizado de íconos
#ProductoEnvioCard.test.js	✅ Sí	onConfigurarEnvio, onEntregarProducto