var Following= function(avatar,firstname,lastname,photo,userId,boardId,obj){
	this.avatar = avatar;
	this.firstname = firstname;
	this.lastname = lastname;
	this.photo = photo;	
	this.userId = userId;
	this.boardId = boardId;
	this.source = obj;
};

module.exports = Following;
