import WebGLApp from '../../libs/mgu/webgl-app.js';
import Matrix4 from '../../libs/cuon-matrix.js';

class App extends WebGLApp {
  ready() {
    this.registerOnKeyDown();

    this.info = document.getElementById('info');

    this.nearPlane = 0.0;
    this.farPlane = 0.5;

    this.u_ProjMatrix = this.getUniformLocation('u_ProjMatrix');
    this.projMatrix = new Matrix4();

    const verticesData = App.initVertices();
    this.n = 6;

    // see "stride" and "offset" here: https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/vertexAttribPointer
    const stride = 6 * verticesData.BYTES_PER_ELEMENT;
    const positionOffset = 0;
    const colorOffset = 3 * verticesData.BYTES_PER_ELEMENT;

    const vertexBuffer = this.gl.createBuffer();
    if (!vertexBuffer) console.error('Failed to create vertex buffer.');
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer);

    const a_Position = this.getAttribLocation('a_Position');
    this.gl.bufferData(this.gl.ARRAY_BUFFER, verticesData, this.gl.STATIC_DRAW);
    this.gl.vertexAttribPointer(a_Position, 3, this.gl.FLOAT, false, stride, positionOffset);
    this.gl.enableVertexAttribArray(a_Position);

    const a_Color = this.getAttribLocation('a_Color');
    this.gl.bufferData(this.gl.ARRAY_BUFFER, verticesData, this.gl.STATIC_DRAW);
    this.gl.vertexAttribPointer(a_Color, 3, this.gl.FLOAT, false, stride, colorOffset);
    this.gl.enableVertexAttribArray(a_Color);

    this.gl.clearColor(0.1, 0.1, 0.1, 1); // set black as clear color
    this.draw();
  }

  static initVertices() {
    const triangle1 = [
      0.0, 0.5, 0.2, 1.0, 1.0, 1.0,
      -0.5, -0.5, 0.2, 0.0, 1.0, 0.0,
      0.5, -0.5, 0.2, 1.0, 1.0, 0.0,
    ];
    const triangle2 = [
      0.5, 0.4, 0.3, 1.0, 0.4, 0.4,
      -0.5, 0.4, 0.3, 1.0, 1.0, 0.4,
      0.0, -0.6, 0.3, 1.0, 1.0, 0.4,
    ];
    return new Float32Array([
      // vec3, vec3 rgb
      ...triangle1,
      ...triangle2,
    ]);
  }

  registerOnKeyDown() {
    document.onkeydown = (ev) => {
      this.onKeyDown(ev);
    };
  }

  onKeyDown(ev) {
    const KEY_LEFT = 37;
    const KEY_RIGHT = 39;
    const KEY_UP = 38;
    const KEY_DOWN = 40;

    const increment = 0.05;

    if (ev.keyCode === KEY_LEFT) {
      this.nearPlane -= increment;
    }
    if (ev.keyCode === KEY_RIGHT) {
      this.nearPlane += increment;
    }
    if (ev.keyCode === KEY_UP) {
      this.farPlane += increment;
    }
    if (ev.keyCode === KEY_DOWN) {
      this.farPlane -= increment;
    }
    this.draw();
  }

  draw() {
    // update HTML
    this.info.innerHTML = `
      nearPlane = ${Math.round(this.nearPlane * 100) / 100} <br>
      farPlane = ${Math.round(this.farPlane * 100) / 100}`;

    this.projMatrix = this.projMatrix.setOrtho(-1.0, 1.0, -1.0, 1.0, this.nearPlane, this.farPlane);
    this.gl.uniformMatrix4fv(this.u_ProjMatrix, false, this.projMatrix.elements);

    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    this.gl.drawArrays(this.gl.TRIANGLES, 0, this.n);
  }
}

const app = new App();
app.start();
