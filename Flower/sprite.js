class Sprite{
    constructor(options){
        this.context = options.context;
        this.width = options.width;
        this.height = options.height;
        this.image = options.image;
        this.json = options.json;
        this.index = options.index;
        this.frameData = options.frameData;
        this.x = options.x;
        this.y = options.y;
        this.anchor = (options.anchor == null) ? {x:0.5, y:0.5} : options.anchor;
        this.states = options.states;
        this.state = options.states[options.state];
        this.scale = (options.scale==null) ? 1.0 : options.scale;
        this.opacity = (options.opacity==null) ? 1.0 : options.opacity;
        this.currentTime = 0;
        this.kill = false;    
        // this.frame = options.frame;
        // this.image = options.image;
        // this.state = 0;
         
        this.state.duration = this.state.frames.length * (1.0/ this.state.fps);
    }

    update(dt){
        this.stateTime += dt;
        if(this.currentTime > this.state.duration){
            if(this.state.loop){
                this.currentTime -= this.state.duration;
            }
        }
        this.x += this.state.motion.x * dt;
        this.y += this.state.motion.y * dt;
        
        if(this.x > 500){
            this.x = -100;
        }
        
        const  index = Math.floor((this.currentTime/this.state.duration) * this.state.frames.length);
        this.frameData = this.json.frames[this.state.frames[index]];
        
        // const state = this.state;
        // if(state == null){
        //     this.kill = true;
        //     return;
        // }
        //
        // const delta = this.stateTime/state.duration;
        //
        // if(delta > 1){
        //     this.state = this.stateIndex + 1;
        // }
        //
        // switch(state.mode){
        //     case "spawn":
        //             this.scale = delta;
        //             this.opacity = delta;
        //             break;
        //     case "static":
        //             this.scale = 1.0;
        //             this.opacity = 1.0;
        //             break;
        //     case "die":
        //             this.scale = 1.0 + delta;
        //             this.opacity = 1.0 - delta;
        //             if(this.opacity < 0){
        //                 this.opacity = 0;
        //             }
        //             break;
        // }

        
    }

    render(){
        const alpha = this.context.globalAlpha;

        this.context.globalAlpha = this.opacity;
        
        const frame = this.frameData.frame;
        const offset = this.offset;

        this.context.drawImage(
            this.image,
            frame.x,
            frame.y,
            frame.w,
            frame.h,
            this.x - offset.x,
            this.y - offset.y,
            this.w * this.scale,
            this.h * this.scale
        );

        this.context.globalAlpha = alpha;
        // this.context.drawImage(
        //     this.image,
        //     this.frame.x,
        //     this.frame.y,
        //     this.frame.w,
        //     this.frame.h,
        //     this.x - this.frame.w * this.scale * this.anchor.x,
        //     this.y - this.frame.h * this.scale * this.anchor.y,
        //     this.frame.w * this.scale,
        //     this.frame.h * this.scale
        // );
        
    }

    // set state(index){
    //     this.stateIndex = index;
    //     this.stateTime = 0;
    // }
    getState(){
        let stateTime = 0;
        for(var i=0; i<this.states.length; i++){
            const state = {"mode":this.state[i].mode, "duration":this.states[i].duration};
            if(this.currentTime >= stateTime && this.currentTime<(stateTime + state.duration)){
                state.time = this.currentTime - stateTime;
                return state;
            }
            else{
                stateTime += state.duration;
            }
        }
        
        
        // let result;
        // if(this.stateIndex<this.states.length){
        //     result = this.states[this.stateIndex];
        // }
        //
        // return result;
    }
    
    hitTest(pt){
        const centre = {x: this.x, y: this.y};
        const radius = (this.width * this.scale) / 2;
        
        const dist = distanceBetweenPoint(pt, centre);
        
        return (dist < radius)
        
        function distanceBetweenPoint(a, b){
            var x = a.x -b.x;
            var y = a.y - b.y;
            
            return Math.sqrt(x*x + y*y);
        }
    }
    
    get offset(){
        const scale = this.scale;
        const w = this.frameData.sourceSize.w;
        const h = this.frameData.sourceSize.h;
        const  x = this.frameData.spriteSourceSize.x;
        const  y = this.frameData.spriteSourceSize.y;
        return{
            x: (x-x) * scale * this.anchor.x,
            y: (h-y) * scale* this.anchor.y
        };
    }
}