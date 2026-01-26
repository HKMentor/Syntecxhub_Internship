const quizData = [
 {q:"HTML stands for?",o:["Hyper Text Markup Language","High Tool ML","Home Text ML","Hyperlinks Tool"],a:0},
 {q:"CSS purpose?",o:["Logic","Styling","Database","Server"],a:1},
 {q:"JavaScript is?",o:["Markup","Styling","Programming","Database"],a:2},
 {q:"Bootstrap is?",o:["Framework","Language","Server","Browser"],a:0},
 {q:"Semantic tag?",o:["div","span","header","b"],a:2},
 {q:"GitHub use?",o:["Design","Code Hosting","Testing","Editing"],a:1},
 {q:"Frontend stack?",o:["HTML CSS JS","Python","SQL","PHP"],a:0}
];

const state = {
  index:0,
  score:0,
  locked:false,
  time:15,
  timer:null
};

const qNo = document.getElementById("qNo");
const question = document.getElementById("question");
const choices = document.getElementById("choices");
const next = document.getElementById("next");
const bar = document.getElementById("bar");
const timerEl = document.getElementById("timer");

function startTimer(){
  state.time = 15;
  timerEl.classList.remove("danger");
  timerEl.innerHTML = `<i class="bi bi-clock"></i> <b>${state.time}</b>s`;

  state.timer = setInterval(()=>{
    state.time--;
    timerEl.innerHTML = `<i class="bi bi-clock"></i> <b>${state.time}</b>s`;
    if(state.time <= 5) timerEl.classList.add("danger");
    if(state.time === 0){
      clearInterval(state.timer);
      revealAnswer();
    }
  },1000);
}

function load(){
  state.locked=false;
  next.style.display="none";
  choices.innerHTML="";

  const q = quizData[state.index];
  qNo.innerText = `Q${state.index+1} / 7`;
  bar.style.width = `${((state.index+1)/quizData.length)*100}%`;
  question.innerText = q.q;

  startTimer();

  q.o.forEach((opt,i)=>{
    const div=document.createElement("div");
    div.className="choice";
    div.innerHTML=`<i class="bi bi-circle"></i> ${opt}`;
    div.onclick=()=>select(div,i);
    choices.appendChild(div);
  });
}

function select(el,i){
  if(state.locked) return;
  state.locked=true;
  clearInterval(state.timer);

  const correct = quizData[state.index].a;
  const all = document.querySelectorAll(".choice");

  all[correct].classList.add("correct");
  all[correct].innerHTML=`<i class="bi bi-check-circle"></i> ${all[correct].innerText}`;

  if(i!==correct){
    el.classList.add("wrong");
    el.innerHTML=`<i class="bi bi-x-circle"></i> ${el.innerText}`;
  }else state.score++;

  next.style.display="block";
}

function revealAnswer(){
  state.locked=true;
  document.querySelectorAll(".choice")[quizData[state.index].a]
    .classList.add("correct");
  next.style.display="block";
}

next.onclick=()=>{
  state.index++;
  state.index<quizData.length ? load() : result();
};

function result(){
  const percent = Math.round((state.score/7)*100);
  const grade = percent>=85?"A+":percent>=70?"A":percent>=50?"B":"C";

  document.querySelector(".quiz-app").innerHTML=`
    <h3 class="text-center">Quiz Result</h3>
    <h4 class="text-center">${state.score}/7 (${percent}%)</h4>
    <p class="text-center">Grade: <b>${grade}</b></p>
    <button class="btn btn-success w-100 mt-3" onclick="location.reload()">
      Restart <i class="bi bi-arrow-repeat"></i>
    </button>
  `;
}

load();
