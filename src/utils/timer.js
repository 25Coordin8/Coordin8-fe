// 집중 모드 타이머 클래스
export class FocusTimer {
    constructor(onUpdate) {
        this.startTime = null;
        this.elapsed = 0;
        this.interval = null;
        this.isRunning = false;
        this.onUpdate = onUpdate;
    }

    start() {
        if (!this.isRunning) {
            this.startTime = Date.now() - this.elapsed;
            this.interval = setInterval(() => {
                this.elapsed = Date.now() - this.startTime;
                if (this.onUpdate) {
                    this.onUpdate(this.getTimeString());
                }
            }, 1000);
            this.isRunning = true;
        }
    }

    pause() {
        if (this.isRunning) {
            clearInterval(this.interval);
            this.isRunning = false;
        }
    }

    reset() {
        this.pause();
        this.elapsed = 0;
        if (this.onUpdate) {
            this.onUpdate(this.getTimeString());
        }
    }

    getTimeString() {
        const minutes = Math.floor(this.elapsed / 60000);
        const seconds = Math.floor((this.elapsed % 60000) / 1000);
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
}

