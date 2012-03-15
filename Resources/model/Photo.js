var Photo = function(id,pictureUrl,width,height,boardId,board,description,website,
						dateCreated,repinCount,likeCount,commentCount,comments){
	this.id=id;
	this.url = pictureUrl;
	this.width = width;
	this.height = height;
	this.boardId = boardId;
	this.board = board;
	this.description = description;
	this.website = website;
	this.dateCreated = dateCreated;
	this.repinCount = repinCount;
	this.likeCount = likeCount;
	this.commentCount = commentCount;
	this.comments=comments;
	this.hasLiked = false;
}
module.exports = Photo;
