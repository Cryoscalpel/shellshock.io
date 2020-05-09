// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://shellshock.io/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/dat-gui/0.6.5/dat.gui.min.js
// ==/UserScript==

(function() {

    let ping = document.getElementById('ping');


    const getPing = ()=>{
        try{return parseInt(ping.innerText.toLowerCase().replace('ms', ''))}catch(e){
            document.getElementById('ping');
            return 40}};

    let lastShotSpread = 0;

    WebSocket = class extends WebSocket{
        constructor(a){
            console.log(a);
            super(...arguments);
        }
        send(){
            //console.log(arguments[0]);
            super.send(...arguments);
        }

        set onmessage(callback){
            const oldHook = callback;
            callback = function(e){
                // console.log(e.data);
                return oldHook.apply(this, arguments);
            }
            super.onmessage = callback;
        }
    }
    'use strict';
    const oldDefine = Object.defineProperty;
    Object.defineProperty = function(a,b,c){

        if(arguments[1]=="collisionMask" || b == "collisionMask"){
        }

        return oldDefine.apply(this,arguments);
    }


    window.players = new Map();
    window.myPlayer = null;
    var push = Array.prototype.push;

    window.settings = {
        hasPwned:false,
        wireFrame:false,
        ESP:true,
        fog:0,
        myName: "ImHell",
        FOV:1,
        Recoil:0,
        aimbot:true,
        ESPID :2,
        ToggleAim:'KeyF',
        EggSize:1,
    }

    let nameFind = setInterval(function(){
        if(document.getElementsByClassName("ss_field fullwidth")[0].value){
            window.settings.myName = document.getElementsByClassName("ss_field fullwidth")[0].value;
        }
    },1000)
    document.addEventListener('keydown', (e)=>{
        if(e.code===window.settings.ToggleAim) window.settings.aimbot=true;
    })

    document.addEventListener('keyup', (e)=>{
        if(e.code===window.settings.ToggleAim) window.settings.aimbot=false;
    })

    Array.prototype.push = function(data) {

        try{
            //console.log(this);
            if(arguments[0].origin || this.origin){};
            if(arguments[0].player && arguments[0].id){
                arguments[0].player.HACK_VISIBLE = true;
                window.players.set(arguments[0].player.id, arguments[0].player);

            }
        }catch(e){}

        return push.apply(this, arguments);
    }

    const getNearest = (myPlayer, them) => {
        let nearest = {object:null,dist:null};
        them.forEach((obj, ts) =>{
            if(!obj){};

            if(!obj.derp && obj.actor){
                Object.defineProperty(obj.actor.bodyMesh, 'renderingGroupId',  {
                    get: () => {
                        return window.settings.ESPID;
                    }
                });

                const setVis = obj.actor.mesh.setVisible;
                obj.actor.mesh.setVisible = function(args){
                    obj.HACK_VISIBLE = args;
                    if(window.settings.ESP){
                        return setVis.apply(this,[true]);
                    }else{
                        return setVis.apply(this,arguments);
                    }

                }

                obj.derp =true;
            }

            if(obj.actor){
                obj.actor.bodyMesh.scaling = {x:window.settings.EggSize, y:window.settings.EggSize, z:window.settings.EggSize}
            }


            if(obj && obj.id != myPlayer.id && obj.hp > 0 && (obj.team == 0 || (obj.team != myPlayer.team))){

                let dist = calcDist2d(myPlayer, obj);

                if(!nearest.dist || dist < nearest.dist){
                    nearest.dist=dist;
                    nearest.object=obj;
                }
            }else{};


        })
        return nearest;
    }

    const calcDist2d = (p1,p2) => {
        return Math.sqrt(  (p1.x-p2.x)**2 + (p1.y-p2.y)**2);
    }


    window.getTargetAngle = function(angle){
        if (angle < 0) angle += Math.PI * 2;
        if (angle < 0) angle += Math.PI * 2;
        if (angle < 0) angle += Math.PI * 2;
        if (angle - Math.PI * 2 > 0) angle -= Math.PI * 2;
        if (angle - Math.PI * 2 > 0) angle -= Math.PI * 2;
        if (angle - Math.PI * 2 > 0) angle -= Math.PI * 2;
        return angle;
    };

    window.getTargetDelta = function(them, us, dist){
        return {x: them.x - us.x + them.dx * dist / us.weapon.subClass.velocity,
                y: them.y - us.y + them.dy * dist / us.weapon.subClass.velocity - (((dist/us.weapon.subClass.velocity)**2)/2)*0.012 + 0.092,
                z: them.z - us.z + them.dz * dist / us.weapon.subClass.velocity,
               };
    };

    class SeededRandom{
        constructor(){};

        setSeed(e) {
            this.seed = e
        }
        getFloat(e, t) {
            return e = e || 0,
                t = t || 1,
                this.seed = (9301 * this.seed + 49297) % 233280,
                e + this.seed / 233280 * (t - e)
        }

        getInt(e, t) {
            return Math.floor(this.seededRandom(e, t))
        }

    }

    const adjustedTarget = function(delta, us, Dss, Dt) {
        delta = new BABYLON.Vector3(delta.x, delta.y, delta.z).normalize();
        const desiredMat = BABYLON.Matrix.Translation(delta.x, delta.y, delta.z);

        let shotSpread_per_MS = Dss / Dt;

        let spread = us.shotSpread - shotSpread_per_MS*getPing() + us.weapon.inaccuracy;
        //var spread = 0;

        if (isNaN(spread)) {
            spread = 0;
        }

        const rgenCopy = new SeededRandom();
        rgenCopy.setSeed(us.randomGen.seed);

        const spreadInverseMat = BABYLON.Matrix.RotationYawPitchRoll(
            (rgenCopy.getFloat() - 0.5) * spread,
            (rgenCopy.getFloat() - 0.5) * spread,
            (rgenCopy.getFloat() - 0.5) * spread).invert();

        const newAimVector = desiredMat.multiply(spreadInverseMat).getTranslation();
        return newAimVector;
    };

    window.lookAtHead = function(us, target, dist, Dss, Dt) {
        const delta = window.getTargetDelta(target, us, dist);

        let newAimVector = adjustedTarget(delta, us, Dss, Dt);

        const newYaw = Math.radRange(-Math.atan2(newAimVector.z, newAimVector.x) + Math.PI / 2)

        const newPitch = Math.clamp(-Math.asin(newAimVector.y), -1.5, 1.5);

        us.pitch = newPitch;
        us.yaw = newYaw;

    }

    const clearRect =requestAnimationFrame;
    let update = performance.now();

    requestAnimationFrame = function(){

        window.players.forEach((obj, ts) =>{
            if(obj.ws){
                window.myPlayer = obj;
                window.players.delete(obj.id);
            }
        });
        if(window.myPlayer){

            const deltaShotSpread = myPlayer.shotSpread - lastShotSpread;
            const deltaTime = performance.now() - update;

            update = performance.now();
            lastShotSpread = myPlayer.shotSpread;

            if(!window.settings.hasPwned){
                Object.defineProperty(window.myPlayer.scene.cameras[0], 'fov',  {
                    get: () => {
                        return window.settings.FOV;
                    }
                });
                window.settings.hasPwned=true;

                Object.defineProperty(window.myPlayer.scene, 'forceWireframe',  {
                    get: () => {
                        return window.settings.wireFrame;
                    }
                });

                window.settings.hasPwned=true;
            }
            let ret = getNearest(window.myPlayer, window.players);
            if(ret.object && window.settings.aimbot){
                window.lookAtHead(window.myPlayer, ret.object, ret.dist, deltaShotSpread, deltaTime);

            }else{
            }
        }
        return clearRect.apply(this,arguments);
    }



    datgui();

    function datgui(){
        let gui = new dat.GUI();

        // Settings
        let guiSettings = gui.addFolder('Hacks');
        guiSettings.add(window.settings, 'hasPwned').onChange((e)=>{
            window.settings.hasPwned=e;
        });
        guiSettings.add(window.settings, 'fog',0,10).step(1).onChange((e)=>{
            window.settings.fog=e;
        });

        guiSettings.add(window.settings, 'ESP').onChange((e)=>{
            window.settings.ESP=e;
        });

        guiSettings.add(window.settings, 'ESPID',1,4).step(1).onChange((e)=>{
            window.settings.ESPID=e;
        });
        guiSettings.add(window.settings, 'EggSize',1,10).step(1).onChange((e)=>{
            window.settings.EggSize=e;
        });
        guiSettings.add(window.settings, 'wireFrame').onChange((e)=>{
            window.settings.wireFrame=e;
        });
        guiSettings.add(window.settings, 'myName').onChange();
        guiSettings.add(window.settings, 'FOV', 0,4).step(0.1).onChange((e)=>{
            window.settings.FOV=e;
        });
        guiSettings.add(window.settings, 'Recoil',0,4).step(0.4).onChange((e)=>{
            window.settings.Recoil=e;
        });
        guiSettings.open();
        document.getElementsByClassName("dg ac")[0].style.zIndex=9999;
        return gui;
    }
})();
