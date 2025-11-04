
var left_EyeX = 80;
var left_EyeY = 180;
var left_EyeDir = Math.floor(Math.random() * (12)) + 1;

var right_EyeX = 225;   
var right_EyeY = 180;
var right_EyeDir = Math.floor(Math.random() * (12)) + 1;

var body_X = 130;
var body_Y = 400;
var body_XDir = Math.floor(Math.random() * (5)) + 1;
var body_YDir = Math.floor(Math.random() * (5)) + 1;

var mouth_X =150;
var mouth_Y = 320
var mouth_Dir = Math.floor(Math.random() * (5)) + 1;

var iris_X = 80;
var iris_Y = 180
var iris_DirX = Math.floor(Math.random() * (5)) + 1;
var iris_DirY = Math.floor(Math.random() * (5)) + 1;

var moveSpeed = Math.floor(Math.random() * (25)) + 1;;
var size = 2;
var count = 0;
var sizeDirection = 2;

//Noticed that if I used "textSize" as a variable name, it bugged out..
var dynamicTextSize = 20;
var textDir=1;

function setup()
    {
        createCanvas(300,500);
        console.log("moveSpeed: "+ moveSpeed);  
  
    }
    
function draw()
    {   
        fill("white"); 
        background(220);
        textSize(30);
        text('\'Le Face de\'Blanc', 30, 30);
        fill("blue"); 
        fill("white");
        //Head Shape
        ellipse(150, 225, 250, 350);

        //Left Eye
        ellipse(left_EyeX, left_EyeY, 80, 40);
            left_EyeX+=left_EyeDir;
            if(left_EyeX >= 296 || left_EyeX <= 22)
            {
                left_EyeDir *= -1;
            }


        //Right Eye
        ellipse(right_EyeX, right_EyeY, 80, 40);
        fill("white"); 
        right_EyeX+=right_EyeDir;
            if(right_EyeX >= 296 || right_EyeX <= 22)
            {
                right_EyeDir *= -1;
            }        

        //Schnoz
        triangle(180, 250, 130, 225, 130, 250);
        fill("blue");    

        //Left Iris             
        circle(iris_X,iris_Y,25);
        iris_X+=iris_DirX;
            if(iris_X >= 290 || iris_X <= 22)
            {
                iris_DirX *= -1;
            }

        iris_Y+=iris_DirY;
            if(iris_Y >= 480 || iris_Y <= 22)
            {
                iris_DirY *= -1;
            }  

        //Right Iris
        circle(225,180,25);
        fill("white"); 
        
        //Pupils
        point(80, 180,)
        point(225, 180,)
        
        //Eyebrow
        line(100, 155, 50, 150);
        line(200, 155, 250, 150);
        
        //Body
        rect(body_X, body_Y, 45,80); 
        body_Y+=body_YDir;
            if(body_Y >= 405 || body_Y <= 22)
            {
                body_YDir == moveSpeed;
                body_YDir *= -1;
            } 

        line(130, 420, 80, 450);
        line(175, 420, 225, 450);
        line(160, 480, 165, 500);
        line(140, 480, 145, 500);

        //Mouth
        ellipse(mouth_X, mouth_Y, 100, 25);
        mouth_Y+=mouth_Dir;
            if(mouth_Y >= 405 || mouth_Y <= 22)
            {
                mouth_Dir *= -1;
            } 
        
        //Signature
        fill("black");
        textSize(dynamicTextSize);
        text("~Steven", 10, 495);

        //Text Size Changerupper
        dynamicTextSize += textDir * 0.5;
        if (dynamicTextSize > 40 || dynamicTextSize < 20) {
            textDir *= -1;
        }

        size+= sizeDirection;
        count++;
        
            if(count > 100)
            {
                sizeDirection *=-1;
                count = 0;
                moveSpeed = Math.floor(Math.random() * 25) +5;   
                //console.log("moveSpeed: "+ moveSpeed);  

                left_EyeDir = Math.floor(Math.random() * (6)) + 1;
                //console.log("left_EyeDir: "+ left_EyeDir);  

                right_EyeDir = Math.floor(Math.random() * (12)) + 1;
                //console.log("right_EyeDir: "+ right_EyeDir);  

                body_XDir = Math.floor(Math.random() * (5)) + 1;
                body_YDir = Math.floor(Math.random() * (5)) + 1;
                //console.log("body_XDir: "+ body_XDir);  
                //console.log("body_YDir: "+ body_YDir);  

                mouth_Dir = Math.floor(Math.random() * (5)) + 1;
                //console.log("mouth_Dir: "+ mouth_Dir);  

                iris_DirX = Math.floor(Math.random() * (5)) + 1;
                iris_DirY = Math.floor(Math.random() * (5)) + 1;
                //console.log("iris_DirX: "+ iris_DirX);  
                //console.log("iris_DirY: "+ iris_DirY);  

            }
    }