import WebGLApp from '../../libs/mgu/webgl-app.js';
import Matrix4 from '../../libs/cuon-matrix.js';
import Vector4 from '../../libs/mgu/vector4.js';

class App extends WebGLApp {
  ready() {
    this.registerOnKeyDown();
    this.addNotes();

    this.perspectiveMode = true;

    const verticesData = App.initVertices();
    this.n = 6; // vertices
    this.nearPlane = -2.0;
    this.farPlane = 4.0;

    // see "stride" and "offset" here: https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/vertexAttribPointer
    const stride = 6 * verticesData.BYTES_PER_ELEMENT;
    const positionOffset = 0;
    const colorOffset = 3 * verticesData.BYTES_PER_ELEMENT;

    const vertexBuffer = this.gl.createBuffer();
    if (!vertexBuffer) console.error('Failed to create vertex buffer.');
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer);

    this.u_ProjMatrix = this.getUniformLocation('u_ProjMatrix');
    this.projMatrix = new Matrix4();
    this.u_ViewMatrix = this.getUniformLocation('u_ViewMatrix');
    this.viewMatrix = new Matrix4();

    this.eye = new Vector4(0, 0, 5);
    this.center = new Vector4(0, 0, -100); // look at point
    this.up = new Vector4(0, 1, 0);
    this.viewMatrix.setLookAt(
      this.eye.x, this.eye.y, this.eye.z,
      this.center.x, this.center.y, this.center.z,
      this.up.x, this.up.y, this.up.z,
    );

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
      0.0, 0.5, -0.2, 0.0, 1.0, 1.0,
      -0.5, -0.5, -0.2, 0.0, 1.0, 0.0,
      0.5, -0.5, -0.2, 0.0, 1.0, 0.0,
    ];

    const triangle2 = [
      0.0, 0.5, -1, 1.0, 0.0, 0.0,
      -0.5, -0.5, -1, 1.0, 1.0, 0.0,
      0.5, -0.5, -1, 1.0, 1.0, 0.0,
    ];
    return new Float32Array([
      // vec3, vec3 rgb
      ...triangle2,
      ...triangle1,
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
    const increment = 0.05;
    this.perspectiveMode = !this.perspectiveMode;
    if (ev.keyCode === KEY_LEFT) {
    }
    if (ev.keyCode === KEY_RIGHT) {
    }
  }

  process() {
    this.eye.x = 1 * Math.sin(this.time / 1000);
    this.eye.y = -1 * Math.sin(this.time / 2000);

    this.draw();
  }

  draw() {
    this.viewMatrix.setLookAt(
      this.eye.x, this.eye.y, this.eye.z,
      this.center.x, this.center.y, this.center.z,
      this.up.x, this.up.y, this.up.z,
    );

    if (this.perspectiveMode) {
      this.projMatrix.setPerspective(
        30, // fov y
        this.canvas.width / this.canvas.height, // aspect ratio of the frustum
        1, // near plane
        100, // far plane
      );
    } else {
      this.projMatrix = this.projMatrix.setOrtho(-1, 1, -1, 1, -10, 22);
    }

    this.gl.uniformMatrix4fv(this.u_ViewMatrix, false, this.viewMatrix.elements);
    this.gl.uniformMatrix4fv(this.u_ProjMatrix, false, this.projMatrix.elements);

    // draw
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    this.gl.drawArrays(this.gl.TRIANGLES, 0, this.n);
  }

  addNotes() {
    const el = document.getElementsByClassName('notes').item(0);
    el.innerHTML = `Green and red triangles have the same areas.<br>
    They only differ by their z position. <br>
    Press any key to switch from perspective view to ortho view.`;
  }
}

const app = new App();
app.start();
