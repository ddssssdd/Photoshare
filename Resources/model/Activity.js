var Activity=function(avater,userFName,userLName,operate,targetId,userId,obj){
	this.avater = avater;
	this.firstname = userFName;
	this.lastname = userLName;
	this.operate = operate;
	this.targetId = targetId;
	this.userId = userId;
	this.source = obj;
};


module.exports = Activity;
