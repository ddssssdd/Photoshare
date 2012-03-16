var User = function(userName,password,id,firstname,lastname,nickname,obj){
	this.userName = userName;
	this.login=false;
	this.password = password;
	this.id = id;
	this.firstname = firstname;
	this.lastname = lastname;
	this.nickname = nickname;
	this.source = obj;
	this.avatar ="";
	this.categoryList=[];
	this.boardList=[];
	
}
module.exports = User;
