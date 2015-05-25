var app=new Application();
app.loadJS("../view.js",function (argument) {
	app.loadView(V.login);
	app.loadView(V.register);
});