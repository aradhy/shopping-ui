
function customSingleImageView()
{
  alert("in custom")

    $('.container').imagesLoaded( function() {
   
        $("#exzoom").exzoom({
              autoPlay: false,
          });
        $("#exzoom").removeClass('hidden')
      });
      


}