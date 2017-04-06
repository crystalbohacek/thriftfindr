$(document).ready(function(){


	// Hide all the buttons for editing comments. It might be better to just set display: none for these classes.
		$('input.comment-edit-input').hide();
		$('a.comment-edit-cancel').hide();


    $("a.comment-edit").on('click', function(event){
        event.preventDefault(); 
		//$('input.comment-add').hide();

        var $comment = $(this).parent();
		$comment.find('a.comment-edit').hide();
		$comment.find('p.comment-text').hide();
		$comment.find('input.comment-edit-input').show();
		$comment.find('a.comment-edit-cancel').show();
        return false;
    });

    $("a.comment-edit-cancel").on('click', function(event){
        event.preventDefault();
		//$('input.comment-add').show();
        var $comment = $(this).parent();
		$comment.find('a.comment-edit').show();
		$comment.find('p.comment-text').show();
		$comment.find('input.comment-edit-input').hide();
		$comment.find('a.comment-edit-cancel').hide();
        return false;
    });
});

