(function(){
	var V=window.V={
		login:sn.createView({
			url:"login.html",
			id:"login",
			success:function(){
				console.log("login is loaded");
			}
		}),
		register:sn.createView({
			url:"register.html",
			id:"register",
			success:function(){
				console.log("register is loaded");
			}
		})
	}
	V.login.on("change",function(t){
		console.log(t.value)
	})
})()