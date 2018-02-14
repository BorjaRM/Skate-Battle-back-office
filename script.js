$(document).ready(function(){
  console.log("Jquery esta cargado");

  (function() {
      var output = document.getElementById("data");
      var config = {
        apiKey: "AIzaSyCO4y9RwFOgETt_iJEI43yLpc3HAx_T-og",
        authDomain: "skate-battle.firebaseapp.com",
        databaseURL: "https://skate-battle.firebaseio.com",
        projectId: "skate-battle",
        storageBucket: "skate-battle.appspot.com",
        messagingSenderId: "562929307519"
      };
      firebase.initializeApp(config);
  })();

  // Array de videos sin revisar
  var videoArray = [];
  var numResultados;

  // Obtenemos todos los videos de firebase que no han sido revisados
    firebase.database().ref("videos").orderByChild('revisado').equalTo(false).once("value", function(snapshot) {
        // Vaciamos el array
        videoArray = [];
        numResultados = snapshot.numChildren();
        console.log("Obtenidos " + numResultados + " resultados");

        if (numResultados > 0) {
          console.log("hay videos para revisar");
          $(".container").show();
          snapshot.forEach(function(userSnapshot) {
              // Obtenemos un video y lo añadimos al array
              var video = userSnapshot.val();
              videoArray.push(video);
          });
          muestraVideo();
        } else {
          console.log("todo ok");
          $(".container").hide();
        }
    });

  function muestraVideo() {
    if(videoArray.length > 0) {
      // Mostramos el primer video del array modificando el atributo src del elemento videos
      $("#unVideo").attr('src', videoArray[0].videoUrl);
      $(".container").show();
    } else {
      $(".container").hide();
    }
  }

  $("button").click(function(element){
    var aprobado;
    var revisado;
    if(this.id === "btnSaltar") {
      array_move(videoArray,0,videoArray.length - 1);
      console.log("video saltado");
      muestraVideo();
      return;
    }

    if(this.id === "btnAceptar") {
      aprobado = true;
      console.log("video aprobado");
    } else if (this.id === "btnRechazar") {
      aprobado = false;
      console.log("video rechazado");
    }
    revisado = true;
    firebase.database().ref("videos").child(videoArray[0].videoId).update({ aprobado: aprobado, revisado: revisado });
    var videoRevisado = videoArray.shift();
    console.log("el video " + videoRevisado.videoId + " ha sido revisado");
    muestraVideo();
  });

  function array_move(arr, old_index, new_index) {
      if (new_index >= arr.length) {
          var k = new_index - arr.length + 1;
          while (k--) {
              arr.push(undefined);
          }
      }
      arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
      return arr; // for testing
  };


  // Ponemos el video en reproduccion continua
  $("#unVideo").attr('loop','true');



});
