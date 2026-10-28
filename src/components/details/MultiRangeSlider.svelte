<script>
  const { min, max, onChange } = $props()

  let a = $state(0)
  let b = $state(0)

  const onInput = (e) => {
    const el = e.currentTarget 
    el.parentNode.style.setProperty(`--${el.id}`, el.value)

    if (el.id === 'a') {
      a = parseInt(el.value)
    } else {
      b = parseInt(el.value)
    }

    if (onChange) {
      if (b > a) {
        onChange(a, b)
      } else {
        onChange(b, a)
      }
    }
  }
</script>

<div class="wrap" role="group" aria-labelledby="multi-lbl" style={`--a: ${min}; --b: ${max}; --min: ${min}; --max: ${max}`}>
  <input id="a" type="range" {min} value={min.toString()} step="1" {max} oninput={onInput} />
  <input id="b" type="range" {min} value={max.toString()} step="1" {max} oninput={onInput}/>
</div>

<style>
.wrap {
  --dif: calc(var(--max) - var(--min));
  --width: 25rem;
  --r: 0.5rem;
  --h: 2rem;
  --uw: calc(var(--width) - var(--r) - var(--r));
  display: grid;
  grid-template: repeat(2, max-content) var(--h)/1fr 1fr;
  overflow: hidden;
  position: relative;
  width: var(--width);
  background: linear-gradient(0deg, #ccc var(--h), transparent 0);
}
.wrap::before, .wrap::after {
  grid-column: 1/span 2;
  grid-row: 3;
  background: #0073BD;
  content: "";
}
.wrap::before {
  margin-left: calc(var(--r) + (var(--a) - var(--min))/var(--dif)*var(--uw));
  width: calc((var(--b) - var(--a))/var(--dif)*var(--uw));
}
.wrap::after {
  margin-left: calc(var(--r) + (var(--b) - var(--min))/var(--dif)*var(--uw));
  width: calc((var(--a) - var(--b))/var(--dif)*var(--uw));
}

input[type=range] {
  grid-column: 1/span 2;
  grid-row: 3;
  z-index: 1;
  top: 0;
  left: 0;
  margin: 0;
  background: none;
  /* get rid of white Chrome background */
  --col: #001930;
  pointer-events: none;
}
input[type=range]::-webkit-slider-runnable-track, input[type=range]::-webkit-slider-thumb, input[type=range] {
  -webkit-appearance: none;
}
input[type=range]::-moz-range-track, input[type=range]::-webkit-slider-runnable-track {
  width: 100%;
  height: 100%;
  background: none;
}
input[type=range]::-webkit-slider-thumb, input[type=range]::-moz-range-thumb {
  border: none;
  /* get rid of Firefox thumb border */
  width: calc(var(--r) * 2);
  height: var(--h);
  border-radius: 0;
  background: radial-gradient(circle, var(--col) calc(var(--r) - 1px), transparent var(--r));
  pointer-events: auto;
}
input[type=range]:focus {
  z-index: 2;
  outline: dotted 1px currentcolor;
}
input[type=range]:hover {
  --col: #666 ;
}
input[type=range]:focus {
  --col: #fff ;
}
</style>
