jQuery(document).ready(function ($) {
  console.log("zoom loaded");

  //!                                ____
  //!   ____  ____  ____  ____ ___  / / /
  //!  /_  / / __ \/ __ \/ __ `__ \/ / /
  //!   / /_/ /_/ / /_/ / / / / / /_/_/
  //!  /___/\____/\____/_/ /_/ /_(_|_)

  let imgPosLeft; //.zoom img position left
  let imgPosTop; //.zoom img position top
  let imgWidth;  //.zoom img width
  let imgHeight; //.zoom img height
  let prozent; //zoom factor

  let quotientWidth; //to calculate bg position
  let quotientHeight;//to calculate bg position
  let $bodyOffSetTop;//document scroll top
  let $newBodyOffSetTop;//document scroll top after scroll
  let $diffscroll; //difference of scrolls

  let topLarge; //position top of large div
  let leftLarge; //position left of large div

  let xUp; //mouse x position
  let yUp; //mouse y position
  let $name; //the name of pix hovered .zoom img
  let hasTouch = false; //is it on touchscreen or monitor? SET TO NOT

  //to know if screen or laptop computer

  $("body").one("touchstart", function (e) {
    hasTouch = true;
    console.log("AM ON A SCRREN");
    $(this).off(".noTouch");
  });

  // ZOOM START
  $("body").on("mouseenter.noTouch", ".zoom img", function (e) {
    console.log("ready for zoom");

    if (hasTouch === true) {
      return;
    }

    let parentOffset = $(this).parent().offset();
    //or $(this).offset(); if you really just want the current element's offset
    let relX = e.pageX - parentOffset.left;
    let relY = e.pageY - parentOffset.top;
    // alert(` X ${relX} y ${relY}`);
    console.log(` X ${relX} y ${relY}`);

    xUp = e.pageX;
    yUp = e.pageY;
    $bodyOffSetTop = $(document).scrollTop();
    console.log("zoom Works");
    console.log("$bodyOffSetTop: " + $bodyOffSetTop);
    let src = $(this).attr("src");
    let lastIndex = src.lastIndexOf("-");
    $name = src.substring(0, lastIndex) + ".jpg";
    //alert(name);
    imgPosLeft = $(this).offset().left;
    imgPosTop = $(this).offset().top;
    //imgMarginTop= $('#content').height();
    //imgMarginTop=78;
    // console.log(imgMarginTop);
    console.log("imgPosLeft: " + imgPosLeft);
    console.log("imgPosTop: " + imgPosTop);
    imgWidth = $(this).width();
    imgHeight = $(this).height();
    //console.log('imgWidth: '+imgWidth);
    //console.log('imgHeight: '+imgHeight);
    createNewDiv($name); //put bigPix in div
    //show div
  });

  ////////////////////////////////

  $("body").on(
    "mousewheel.noTouch DOMMouseScroll.noTouch",
    ".zoom img",
    function (e) {
      // console.log('ready for zoom 2');
      if (hasTouch === true) {
        return;
      }

      //console.log('mousewheel DOMMouseScroll zoom 1')
      //   console.log('scroll');
      //   console.log('b4 scroll: '+ $bodyOffSetTop);
      //
      $newBodyOffSetTop = $(document).scrollTop();
      //console.log('after scroll: '+ $newBodyOffSetTop);
      // console.log('diff scroll: '+ ($bodyOffSetTop-$newBodyOffSetTop));
      $diffscroll = $bodyOffSetTop - $newBodyOffSetTop;
      $bodyOffSetTop = $newBodyOffSetTop;

      whereAmIFunction(true, $diffscroll, "mousewheel");
    }
  );
  ///////////////////////////

  $("body").on("mousemove.noTouch", ".zoom img", function (e) {
    console.log("mouse move");
    if (hasTouch === true) {
      console.log("i stop!!");
      return;
    }

    let parentOffset = $(this).parent().offset();
    //or $(this).offset(); if you really just want the current element's offset
    let relX = e.pageX - parentOffset.left;
    let relY = e.pageY - parentOffset.top;
    // alert(` X ${relX} y ${relY}`);
    // console.log(` X ${relX} y ${relY}`);
    let imgWidth = $(this).attr("width");
    let imgHeight = $(this).attr("height");

    console.log("!!!!figureQuotient>imageQuotient");
    xUp = e.pageX;
    yUp = e.pageY;
    whereAmIFunction(false, "", e);

    // let ImgScrollWidth=
    // let ImgScrollHeight=

    xUp = e.pageX;
    yUp = e.pageY;
    console.log("imgWidth: " + imgWidth);
    console.log("imgHeight: " + imgHeight);
    console.log("imgPosLeft: " + imgPosLeft);
    console.log("imgPosTop: " + imgPosTop);
    console.log("xUp: " + xUp);
    console.log("yUp: " + yUp);

    whereAmIFunction(false, "", e);
  });

  $("body").on("mouseleave.noTouch", ".zoom img", function () {
    if (hasTouch === true) {
      return;
    }
    hideZoom("mouseleave");
  });

  //create new Div large
  function createNewDiv(name) {
    console.log("createNewDiv: " + name);
    //console.log('createNewDiv(name)')

    $("#large").css("background-image", "url(" + name + ")");
    //$('#large').css('background-image','url('+urlupload+'centerMe.png)');
    let img = new Image();
    img.src = name;
    //console.log(img.src);
    $(img).on("load", function () {
      let bgImgWidth = img.width;

      console.log("......createNewDiv w:" + bgImgWidth);
      prozent = bgImgWidth / imgWidth;
    });
  }

  function whereAmIFunction(scroll, pixels, e) {
    console.log(
      "...........................whereAmIFunction(scroll: " +
        scroll +
        ",pixels: " +
        pixels +
        ")"
    );
    //$('#bannerText').text('whereAmIFunction: '+scroll+", "+pixels+", "+from);
    if ($("#large").css("display") !== "block") {
      //alert('show');
      $("#large").show();
    }

    if (!scroll) {
      //console.log('not scroll');
      //y = e.pageY;
      //x =  e.pageX;
      //xUp = e.originalEvent.pageX;
      //yUp = e.originalEvent.pageY;
    } else {
      //console.log('scrolliiing: '+xUp+" "+yUp);
      yUp -= $diffscroll;
    }
    //$('#large').text(touchingMe+' x: '+x)//y-100
    //console.log('x:'+x);
    //        console.log('y:'+y);
    //
    //console.log($('#large').width());
    //    console.log ('imgPosLeft'+imgPosLeft);
    //     console.log ('imgWidth'+imgWidth);
    //     console.log ('imgPosTop'+imgPosTop);
    //     console.log ('imgHeight'+imgHeight);
    //     console.log ('x'+x);
    //     console.log ('y'+y);
    quotientWidth = 1 - (xUp - imgPosLeft) / (imgWidth / 2);
    quotientHeight = 1 - (yUp - imgPosTop) / (imgHeight / 2);

    // console.log('quotientWidth: '+quotientWidth +' quotientHeight: '+quotientHeight);
    //quotientWidth=1;
    //quotientHeight=1;
    let quotientWidth100 = 100 - 100 * quotientWidth;
    let quotientHeight100 = 100 - 100 * quotientHeight;
    let bgLeft = (imgPosLeft - xUp) * prozent + quotientWidth100;
    let bgTop = (imgPosTop - yUp) * prozent + quotientHeight100;

    topLarge = yUp - 100 + 80 * quotientHeight; //imgPosTop-100;//-(100*quotientHeight);
    // console.log('2 imgMarginTop: '+imgMarginTop);
    leftLarge = xUp - 100 + 80 * quotientWidth;
    //console.log('topLarge: '+topLarge);
    //console.log('leftLarge: '+leftLarge);
    $("#large")
      .css("top", topLarge) //y-100   .css('top',topLarge)
      .css("left", leftLarge) //-100
      .css("background-position", bgLeft + "px " + bgTop + "px ");

    console.log("top: " + topLarge + " left: " + leftLarge);
    console.log(
      "imgPosLeft: " +
        imgPosLeft +
        " imgPosTop: " +
        imgPosTop +
        " imgWidth: " +
        imgWidth +
        " imgHeight: " +
        imgHeight
    );

    if (
      xUp < imgPosLeft ||
      yUp < imgPosTop ||
      xUp > imgPosLeft + imgWidth ||
      yUp > imgPosTop + imgHeight
    ) {
      hideZoom("whereAmIFunction");
    }
  }

  function hideZoom(from) {
    console.log("hideZoom");
    $("#large").hide();
  }

  //swipe END
}); // JavaScript Document
