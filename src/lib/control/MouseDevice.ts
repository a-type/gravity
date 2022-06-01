import { Device, VectorControl } from '@hmans/controlfreak';
import { Signal } from '@hmans/signal';

export class MouseDevice extends Device {
  onMouseDown = Signal<MouseEvent>();
  onMouseMove = Signal<MouseEvent>();
  onMouseUp = Signal<MouseEvent>();

  mouseX = 0;
  mouseY = 0;
  movementX = 0;
  movementY = 0;

  start() {
    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mousedown', this.handleMouseDown);
    document.addEventListener('mouseup', this.handleMouseUp);
    return this;
  }

  stop() {
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mousedown', this.handleMouseDown);
    document.removeEventListener('mouseup', this.handleMouseUp);
    return this;
  }

  handleMouseMove = (e: MouseEvent) => {
    this.onActivity.emit();
    this.onMouseMove.emit(e);

    this.mouseX = e.clientX;
    this.mouseY = e.clientY;
    this.movementX = e.movementX;
    this.movementY = e.movementY;
  };

  handleMouseDown = (e: MouseEvent) => {
    this.onActivity.emit();
    this.onMouseDown.emit(e);
  };

  handleMouseUp = (e: MouseEvent) => {
    this.onActivity.emit();
    this.onMouseUp.emit(e);
  };

  update() {
    this.movementX = 0;
    this.movementY = 0;
  }

  positionVector = ({ value, controller }: VectorControl) => {
    if (controller.activeDevice === this) {
      value.x = this.mouseX;
      value.y = this.mouseY;
    }
  };

  velocityVector = ({ value, controller }: VectorControl) => {
    if (controller.activeDevice === this) {
      value.x = this.movementX;
      value.y = this.movementY;
    }
  };
}
