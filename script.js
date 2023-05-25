function randomNumber(min, max){ //max excluded
    return Math.floor(Math.random() * (max - min) ) + min;
}

$(".choice-maker").click(function(){
    $(".welcome").css("display","none")
    $(".choice-maker-active").removeClass("choice-maker-active")
    $(this).addClass("choice-maker-active")
    let id = ($(this).html()).replaceAll(' ','')
    $(".decider").css("display","none")
    $(`#${id}`).css("display","flex")
})

//coin flip
let isCoinPlaying = false
var flip = anime({
    targets: '.coin',
    rotateX: 180,
    easing: 'easeInOutSine',
    loop: true,
    direction: 'alternate',
    duration: 300,
    autoplay: false,
});
$("#coinflip").click(function(){
    if($("#coinflip").css("display")!="none"){
        if(!isCoinPlaying){
            isCoinPlaying = true
            flip.play()
            setTimeout(function(){
                if(Math.random() >= .5){
                    console.log("heads");
                    flip.pause() 
                    $(".coin").animate({rotateX: 0});
                } else{
                    console.log("tails");
                    flip.pause()
                    $(".coin").animate({rotateX: 180});
                }
                isCoinPlaying = false
            },2100);
        }
    }
})

//spin the wheel 
const data = [
    { label: 'input 1', value: 1, color: '#FF6384' },
    { label: 'input 2', value: 1, color: '#36A2EB' },
    { label: 'input 3', value: 1, color: '#FFCE56' },
];

// Draw the pie chart
function drawPieChart(data){
    // Get the canvas element
    const canvas = document.getElementById('wheel');
    const ctx = canvas.getContext('2d');

    // Calculate the total value
    const total = data.reduce((sum, item) => sum + item.value, 0);

    let startAngle = 0;
    data.forEach(item => {
        const sliceAngle = (2 * Math.PI * item.value) / total;

        ctx.beginPath();
        ctx.fillStyle = item.color;
        ctx.moveTo(canvas.width / 2, canvas.height / 2);
        ctx.arc(
            canvas.width / 2,
            canvas.height / 2,
            canvas.width / 2,
            startAngle,
            startAngle + sliceAngle
        );
        ctx.closePath();
        ctx.fill();

        startAngle += sliceAngle;
    });
}
drawPieChart(data)
function rgbToHex(rgb){
    return `#${rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/).slice(1).map(n => parseInt(n, 10).toString(16).padStart(2, '0')).join('')}`
}
function generateHTML(){
    const legendText = document.querySelectorAll(".legend-text")
    let generatedHTML = `<div class="legend-list legend-list-edit">`
    for (i = 0; i < legendText.length; ++i) {
        generatedHTML = generatedHTML + `<div class="legend edit"><input type="color" class="color-edit" value="${rgbToHex(((legendText[i].parentElement).children[0]).style.backgroundColor)}"><input type="text" class="legend-input" value="${legendText[i].textContent}"><div><img class="delete" src="./assets/trashcan.svg"></div></div>`
    }
    generatedHTML = generatedHTML + `<button class="legend-add">+ add legend</button></div>`
    return generatedHTML
}
$("#edit-legend").click(function(){
    Swal.fire({
        background: "#DCAE96",
        color: "#381B1F",
        confirmButtonColor: "#43281C",
        confirmButtonText: "save",
        html: generateHTML(),
        didOpen: () => {
            const legendAdd = document.querySelector(".legend-add")
            legendAdd.addEventListener("click", function(){
                const parent = document.querySelector(".legend-list-edit")
                let legend = document.createElement("div")
                legend.classList.add("legend")
                legend.classList.add("edit")
                legend.innerHTML = `<input type="color" class="color-edit" value="#${Math.floor(Math.random()*16777215).toString(16)}"><input type="text" class="legend-input" value=""><div><img class="delete" src="./assets/trashcan.svg"></div>`
                legend.children[2].addEventListener("click",function(){
                    (this.parentElement).remove()
                    if((document.querySelectorAll(".edit")).length == 3){
                        $(".delete").css("display", "none")
                    }  
                })
                parent.insertBefore(legend, legendAdd)

                if(document.querySelectorAll(".edit").length > 3){
                    $(".delete").css("display", "block")
                }
            })

            if(document.querySelectorAll(".edit").length > 3){
                $(".delete").css("display", "block")
            }

            const trashcan = document.querySelectorAll(".delete")
            for(i = 0; i < trashcan.length; i++){
                trashcan[i].addEventListener("click",function(){
                    (this.parentElement.parentElement).remove()    
                    if((document.querySelectorAll(".edit")).length == 3){
                        $(".delete").css("display", "none")
                    }               
                })
            }
        },
        willClose: () => {
            const legendInput = document.querySelectorAll(".legend-input")
            const legendColors = document.querySelectorAll(".color-edit")
            
            const parent = document.querySelector(".legend-list-main")
            let data = []
            let legendList = ``

            for (i = 0; i < legendInput.length; ++i) {
                legendList = legendList + `
                <div class="legend">
                    <span class="color" style="background-color: ${legendColors[i].value};"></span>
                    <span class="legend-text">${legendInput[i].value}</span>
                </div>`

                data.push({ label: legendInput[i].value, value: 1, color: ((legendInput[i].parentElement).children[0]).value})
            }
            parent.innerHTML = legendList
            drawPieChart(data)
        }
    })
})

function getCurrentRotation(el){
    var st = window.getComputedStyle(el, null);
    var tm = st.getPropertyValue("-webkit-transform") ||
             st.getPropertyValue("-moz-transform") ||
             st.getPropertyValue("-ms-transform") ||
             st.getPropertyValue("-o-transform") ||
             st.getPropertyValue("transform") ||
             "none";
    if (tm != "none") {
      var values = tm.split('(')[1].split(')')[0].split(',');
      var angle = Math.round(Math.atan2(values[1],values[0]) * (180/Math.PI));
      return (angle < 0 ? angle + 360 : angle); 
    }
    return 0;
  }

$("#wheelspin").click(function(e){
    if( e.target != this && e.target != document.getElementById("wheel")){return false}
    const canvas = document.getElementById("wheel")
    const duration = anime.random(2000, 5000);
    const rotation = getCurrentRotation(canvas) * 70 
    anime({
        targets: canvas,
        rotateZ: rotation + anime.random(3600, 7200),
        easing: 'easeOutExpo',
        duration: duration,
    });
})

//8 ball
const magicResponses = ["Signs point to yes", "Without a doubt", "My sources say yes", "Yes - definitely", "You may rely on it", "As I see it, yes", "Most likely", "Outlook good", "Yes", "It is certain", "It is decidedly so", "Without question", "Definitely", "Absolutely", "Affirmative", "For sure", "Of course", "Certainly", "It looks good", "Looks promising", "Promising", "Can do", "Why not", "Go for it", "All signs point to yes", "It's a yes", "Don't count on it", "Outlook not so good", "My reply is no", "My sources say no", "Very doubtful", "Better not tell you now", "Ask again later", "Cannot predict now", "Concentrate and ask again", "No", "Not a chance", "Highly unlikely", "Don't bet on it", "Unlikely", "Probably not", "Chances aren't good", "I'm skeptical", "Looks unlikely", "No way", "It's a no", "Definitely not", "Reply hazy, try again", "Better not tell you now", "Ask again later", "Cannot predict now", "Concentrate and ask again", "Maybe", "Possibly"]
let is8ballPlaying = false
let isPredicted = false
$("#magic8ball").click(function(){
    if($("#magic8ball").css("display")!="none"){
        if(!is8ballPlaying){
            if(!isPredicted){
                is8ballPlaying = true
                var animation = document.querySelector(".eightball-base").animate({backgroundColor: "#2B53BB",color: "#F3CE4B"}, {duration: 1000})

                var element = document.querySelector(".eightball");
                element.classList.add("shake-animation");
                setTimeout(function() {
                    element.classList.remove("shake-animation");
                }, 1000);

                document.querySelector(".prediction").innerHTML = `<h1>${magicResponses[randomNumber(0,magicResponses.length+1)]}</h1>`

                $(".eight").fadeOut(function(){
                    $(".prediction").css("display","flex")
                    $(".prediction").animate({opacity:1})
                })

                $(".eightball-text").fadeOut(function(){
                    $(".eightball-text").text("click to reset the 8 ball!")
                    $(".eightball-text").fadeIn()
                })

                animation.onfinish = (e) => {
                    $(".eightball-base").css("background-color","#2B53BB")
                    $(".eightball-base").css("color","#F3CE4B")
                    is8ballPlaying = false
                    isPredicted = true
                }
            } else{
                is8ballPlaying = true

                var animation = document.querySelector(".eightball-base").animate({backgroundColor: "#fff",color: "#000"}, {duration: 1000})

                var element = document.querySelector(".eightball");
                element.classList.add("shake-animation");
                setTimeout(function() {
                    element.classList.remove("shake-animation");
                }, 1000);

                $(".prediction").fadeOut(function(){
                    $(".prediction").css("display","none")
                    $(".eight").fadeIn()
                })

                $(".eightball-text").fadeOut(function(){
                    $(".eightball-text").text("focus deeply then ask the ball your question and click anywhere!")
                    $(".eightball-text").fadeIn()
                })

                animation.onfinish = (e) => {
                    $(".eightball-base").css("background-color","#fff")
                    $(".eightball-base").css("color","#000")
                    is8ballPlaying = false
                    isPredicted = false
                }
            }
        }
    } 
})


//dice roll
var isDicePlaying = false
var roll = anime({
    targets: '.dice',
    rotateX: anime.random(720,2160),
    rotateZ: anime.random(720,4320),
    easing: 'linear',
    loop: true,
    duration: 500,
    autoplay: false,
});
$("#diceroll").click(function(){
    if($("#diceroll").css("display")!="none"){
        if(!isDicePlaying){
            isDicePlaying = true
            roll.play()
            setTimeout(function(){
                switch (randomNumber(1,7)){
                    case 1:
                        console.log(1)
                        roll.pause() 
                        anime({
                            targets: '.dice',
                            keyframes: [
                                {rotateX: 360, rotateY: 0, rotateZ:720},
                                {rotateX: 0, rotateY: 0, rotateZ:0},
                            ], 
                            easing: 'easeInOutSine', 
                            duration: 250,
                        })  
                        break
                    case 2:
                        console.log(2)
                        roll.pause() 
                        anime({
                            targets: '.dice',
                            keyframes: [
                                {rotateX: 360, rotateY: 0, rotateZ:720},
                                {rotateX: 90, rotateY: 0, rotateZ:0},
                            ], 
                            easing: 'easeInOutSine', 
                            duration: 250,
                        })  
                        break
                    case 3:
                        console.log(3)
                        roll.pause() 
                        anime({
                            targets: '.dice',
                            keyframes: [
                                {rotateX: 360, rotateY: 0, rotateZ:720},
                                {rotateX: 360, rotateY: -90, rotateZ:0},
                            ], 
                            easing: 'easeInOutSine', 
                            duration: 250,
                        })  
                        break
                    case 4:
                        console.log(4)
                        roll.pause() 
                        anime({
                            targets: '.dice',
                            keyframes: [
                                {rotateX: 360, rotateY: 0, rotateZ:720},
                                {rotateX: -90, rotateY: 0, rotateZ:0}
                            ], 
                            easing: 'easeInOutSine', 
                            duration: 250,
                        })  
                        break
                    case 5:
                        console.log(5)
                        roll.pause() 
                        anime({
                            targets: '.dice',
                            keyframes: [
                                {rotateX: 360, rotateY: 0, rotateZ:720},
                                {rotateX: 360, rotateY: 90, rotateZ:0},
                            ], 
                            easing: 'easeInOutSine', 
                            duration: 250,
                        })   
                        break
                    case 6:
                        console.log(6)
                        roll.pause() 
                        anime({
                            targets: '.dice',
                            keyframes: [
                                {rotateX: 360, rotateY: 0, rotateZ:720},
                                {rotateX: 360, rotateY: 180, rotateZ:0},
                            ], 
                            easing: 'easeInOutSine', 
                            duration: 250,
                        })  
                        break
                }
                isDicePlaying = false
            },1500);
        }
    }
})