// ==UserScript==
// @name         ShellShockers Utilities
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       CryoScalpel
// @match        https://shellshock.io/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    window.Utils = {

        selfDestructed:false,

        selfdestruct: ()=>{
           if(!Utils.selfDestructed){

               try{
                   document.getElementsByClassName('guify-container_be6yU')[0].remove()
                   Utils.WireFrame = false;
                   Utils.Aimbot= false;
                   Utils.EggSize = 1;
                   Utils.ESP = false;
                   Utils.BndingBox = false;
                   Utils.AimbotKey = null;
                   Utils.ESPKey = null;
               }catch(e){}

           }
        },

        entities: new Map(),
        myPlayer:null,

        settings: {
            ESP: false,
            Aimbot: true,
            EggSize: 1,
            WireFrame: false,
            FOV:1.25,
            Lag:0,
            BoundingBox: true,
            AimbotDistance: 4,
            AimbotSmoothness:1,
            AimbotMode: 0,
            hasHooked: false,

            AimbotKey: "KeyF",
            ESPKey: "KeyT",
            displayText: "Cryo#6969",

            PanicKey: "Equal",

        },

        ping: document.getElementById('ping'),

        setKeyBind: (callback)=>{
            Utils.settings[callback] = "Press any key";
            let click = 0;
            document.addEventListener('keydown', function abc(event) {
                click++;
                if (click >= 1) {
                    Utils.settings[callback] = event.code;
                    document.removeEventListener('keydown', abc);
                }
            });
        },

        getPing: ()=>{
            try{return parseInt(Utils.ping.innerText.toLowerCase().replace('ms', ''))}catch(e){
                Utils.ping=document.getElementById('ping');
                return 40}},

        initUI: ()=>{
            let container = document.body;
            let gui = new guify({
                title: 'Cryo',
                theme: 'dark', // dark, light, yorha, or theme object
                align: 'right', // left, right
                width: 300,
                barMode: 'none', // none, overlay, above, offset
                panelMode: 'none',
                opacity: 0.95,
                root: window.container,
                open: true
            });

            gui.Register({
                type: 'folder',
                label: 'Utilities',
                open: false
            });

            // Add to the folder example
            gui.Register([

                {
                    type: 'title',
                    label: 'Toggles'
                },
                {
                    type: 'checkbox',
                    label: 'ESP',
                    object: Utils.settings,
                    property: 'ESP',
                    onChange: (data) => {
                        Utils.settings.ESP = data;
                    }
                },
                {
                    type: 'checkbox',
                    label: 'Aimbot',
                    object: Utils.settings,
                    property: 'Aimbot',
                    onChange: (data) => {
                        Utils.settings.Aimbot = data;
                    }
                },


                {
                    type: 'checkbox',
                    label: 'WireFrame',
                    object: Utils.settings,
                    property: 'WireFrame',
                    onChange: (data) => {
                        Utils.settings.WireFrame = data;
                    }
                },
                {
                    type: 'title',
                    label: 'Quick Settings'
                },
                {
                    type: 'range',
                    label: 'Aimbot Distance',
                    min: 0, max: 1000,
                    object: Utils.settings, property: "AimbotDistance",
                    onChange: (data) => {
                        Utils.settings.AimbotDistance = data;
                    }
                },
                {
                    type: 'range',
                    label: 'Lag',
                    min: 0, max: 5000,
                    object: Utils.settings, property: "Lag",
                    onChange: (data) => {
                        Utils.settings.Lag = data;
                    }
                },
                {
                    type: 'range',
                    label: 'Aimbot Smoothness',
                    min: 0, max: 1000, step: 10,
                    object: Utils.settings, property: "AimbotSmoothness",
                    onChange: (data) => {
                        Utils.settings.AimbotSmoothness = data;
                    }
                },

                {
                    type: 'range',
                    label: 'Aimbot Mode',
                    min: 0, max: 0, step: 10,
                    object: Utils.settings, property: "AimbotMode",
                    onChange: (data) => {
                        Utils.settings.AimbotMode = data;
                    }
                },

                { type: 'button', label: 'Set Aimbot Key',  action: (data) => {
                    Utils.setKeyBind('AimbotKey');
                }},

                { type: 'button', label: 'Set ESP Key',  action: (data) => {
                    Utils.setKeyBind('ESPKey');
                }},


                { type: 'button', label: 'Set Panic Key',  action: (data) => {
                    Utils.setKeyBind('PanicKey');
                }},

                { type: 'text', label: 'AimbotKey', object: Utils.settings, property: "AimbotKey",
                 onChange: (data) => {
                     Utils.settings.AimbotKey = data;
                 } },

                { type: 'text', label: 'ESPKey', object: Utils.settings, property: "ESPKey",
                 onChange: (data) => {
                     Utils.settings.ESPKey = data;
                 } },

                { type: 'text', label: 'PanicKey', object: Utils.settings, property: "PanicKey",
                 onChange: (data) => {
                     Utils.settings.PanicKey = data;
                 } },

                {
                    type: 'title',
                    label: 'Credits / Help'
                },

                {
                    type: 'display',
                    label: 'Developer',
                    object: Utils.settings,
                    property: 'displayText'
                },

                {
                    type: 'button',
                    label: 'My Discord',
                    action: () => {
                        console.log('Clicked');
                    }
                },

            ], {
                folder: 'Utilities'
            });

            gui.Register({
                type: 'folder',
                label: 'Visuals',
                open: false
            });

            // Add to the folder example
            gui.Register([

                {
                    type: 'title',
                    label: 'Toggles'
                },

                {
                    type: 'range',
                    label: 'EggSize',
                    min: .1, max: 10,
                    object: Utils.settings, property: "EggSize",
                    onChange: (data) => {
                        Utils.settings.EggSize = data;
                    }
                },

                {
                    type: 'checkbox',
                    label: 'BoundingBox',
                    object: Utils.settings,
                    property: 'BoundingBox',
                    onChange: (data) => {
                        Utils.settings.BoundingBox = data;
                    }
                },

                {
                    type: 'range',
                    label: 'FOV',
                    min: 1.25, max: 3.14,
                    object: Utils.settings, property: "FOV",
                    onChange: (data) => {
                        Utils.settings.FOV = data;
                    }
                },


            ], {
                folder: 'Visuals'
            });


        },

        controller: class{

            constructor(){

                document.addEventListener('keydown', (e)=>{
                    if(e.code===Utils.settings.AimbotKey) Utils.settings.aimbot=true;
                    if(e.code===Utils.settings.PanicKey) Utils.selfdestruct();
                })

                document.addEventListener('keyup', (e)=>{
                    if(e.code===Utils.settings.AimbotKey) Utils.settings.aimbot=false;
                })

            }

        },

        hookWS: ()=>{

            window.WebSocket = new Proxy(window.WebSocket, {
                construct: function(target, args) {
                    const ws = window.ws = new target(...args);

                    // WebSocket "onopen"
                    const openHandler = (event) => {
                        console.log('Open', event);
                    };

                    // WebSocket "onmessage"
                    const messageHandler = (event) => {
                        //got a message
                    };

                    // WebSocket "onclose"
                    const closeHandler = (event) => {
                        console.log('Close', event);
                        // remove event listeners
                        ws.removeEventListener('open', openHandler);
                        ws.removeEventListener('message', messageHandler);
                        ws.removeEventListener('close', closeHandler);
                    };

                    // add event listeners
                    ws.addEventListener('open', openHandler);
                    ws.addEventListener('message', messageHandler);
                    ws.addEventListener('close', closeHandler);

                    ws.send = new Proxy(ws.send, {
                        apply: function(target, that, [args]) {
                            // do shit

                            target.apply(that, [args.buffer]);
                        }
                    });

                    return ws;
                }
            })

        },

        hookArray: ()=>{
            const push = Array.prototype.push;
            Array.prototype.push = function(data) {
                try{
                    if(arguments[0].player && arguments[0].player.id){
                        Utils.entities.set(arguments[0].player.id, arguments[0].player);
                    }
                }catch(e){}
                return push.apply(this, arguments);
            }
        },


        calcDist2d: (p1,p2) => {
            return Math.sqrt(  (p1.x-p2.x)**2 + (p1.y-p2.y)**2 + (p1.z-p2.z)**2);
        },


        getTargetAngle: (angle)=>{
            if (angle < 0) angle += Math.PI * 2;
            if (angle < 0) angle += Math.PI * 2;
            if (angle < 0) angle += Math.PI * 2;
            if (angle - Math.PI * 2 > 0) angle -= Math.PI * 2;
            if (angle - Math.PI * 2 > 0) angle -= Math.PI * 2;
            if (angle - Math.PI * 2 > 0) angle -= Math.PI * 2;
            return angle;
        },

        getTargetDelta: (them, us, dist)=>{
            return {x: them.x - us.x + 2*(them.dx * dist / us.weapon.subClass.velocity),
                    y: them.y - us.y + them.dy * dist / us.weapon.subClass.velocity - (((dist/us.weapon.subClass.velocity)**2)/2)*0.012 - 0.072,
                    z: them.z - us.z + 2*(them.dz * dist / us.weapon.subClass.velocity),
                   };
        },

        getNearest: (myPlayer, them) => {
            let nearest = {object:null,dist:Number.MAX_SAFE_INTEGER};
            them.forEach((obj, ts) =>{
                if(obj){
                    if(!obj.derp && obj.actor){
                        Object.defineProperty(obj.actor.bodyMesh, 'renderingGroupId',  {
                            get: () => {
                                return 3;
                            }
                        });

                        Object.defineProperty(obj.actor.bodyMesh, 'scaling',  {
                            get: () => {
                                return {x:Utils.settings.EggSize, y:Utils.settings.EggSize, z:Utils.settings.EggSize};
                            }
                        });

                        const setvisible = obj.actor.bodyMesh.setVisible;
                        obj.actor.bodyMesh.setVisible = function(){
                            if(Utils.settings.ESP){
                                return setvisible.apply(this,[true])
                            }
                            return setvisible.apply(this,arguments)
                        }

                        obj.derp =true;

                    }

                    if(obj.actor){
                        obj.actor.bodyMesh.showBoundingBox = Utils.settings.BoundingBox;
                    }

                    if(obj && obj.playing && obj.id != myPlayer.id && obj.hp > 0 && (obj.team == 0 || (obj.team != myPlayer.team))){

                        let dist = Utils.calcDist2d(myPlayer, obj);

                        if(dist < nearest.dist){
                            nearest.dist=dist;
                            nearest.object=obj;
                        }
                    }else{};

                }
            })
            return nearest;
        },

        SeededRandom: class{
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

        },

        adjustedTarget: (delta, us, Dss, Dt)=>{
            delta = new BABYLON.Vector3(delta.x, delta.y, delta.z).normalize();
            const desiredMat = BABYLON.Matrix.Translation(delta.x, delta.y, delta.z);

            let shotSpread_per_MS = Dss / Dt;

            let spread = us.shotSpread + us.weapon.inaccuracy;
            //var spread = 0;
            if(spread < 0.1){return delta};
            if (isNaN(spread)) {
                spread = 0;
            }

            const rgenCopy = new Utils.SeededRandom();
            rgenCopy.setSeed(us.randomGen.seed);

            const spreadInverseMat = BABYLON.Matrix.RotationYawPitchRoll(
                (rgenCopy.getFloat() - 0.5) * spread,
                (rgenCopy.getFloat() - 0.5) * spread,
                (rgenCopy.getFloat() - 0.5) * spread).invert();

            const newAimVector = desiredMat.multiply(spreadInverseMat).getTranslation();
            return newAimVector;
        },

        lookAtHead: (us, target, dist, Dss, Dt)=>{
            const delta = Utils.getTargetDelta(target, us, dist);

            let newAimVector = Utils.adjustedTarget(delta, us, Dss, Dt);

            const newYaw = Math.radRange(-Math.atan2(newAimVector.z, newAimVector.x) + Math.PI / 2)

            const newPitch = Math.clamp(-Math.asin(newAimVector.y), -1.5, 1.5);

            us.pitch = newPitch;
            us.yaw = newYaw;

        },

        hookCRect: ()=>{

            const clearRect =requestAnimationFrame;
            let update = performance.now();
            let lastShotSpread = 0;
            requestAnimationFrame = function(){

                if(!Utils.myPlayer){
                    Utils.entities.forEach((obj, ts) =>{
                        if(obj.ws){
                            Utils.myPlayer = obj;
                            Utils.entities.delete(obj.id);
                        }
                    });
                }

                if(Utils.myPlayer){

                    const deltaShotSpread = Utils.myPlayer.shotSpread - lastShotSpread;
                    const deltaTime = performance.now() - update;

                    update = performance.now();
                    lastShotSpread = Utils.myPlayer.shotSpread;


                    if(!Utils.settings.hasHooked){



                        Object.defineProperty(Utils.myPlayer.scene.cameras[0], 'fov',  {
                            get: () => {
                                return Utils.settings.FOV;
                            }
                        });
                        window.settings.hasPwned=true;

                        Object.defineProperty(Utils.myPlayer.scene, 'forceWireframe',  {
                            get: () => {
                                return Utils.settings.WireFrame;
                            }
                        });

                        Utils.settings.hasHooked=true;
                    }


                    let ret = Utils.getNearest(Utils.myPlayer, Utils.entities);
                    if(ret.object && Utils.settings.Aimbot){
                        Utils.lookAtHead(Utils.myPlayer, ret.object, ret.dist, deltaShotSpread, deltaTime);
                    }else{
                    }
                }
                return clearRect.apply(this,arguments);
            }

        },

        LoadHack: ()=>{

            //Utils.hookWS();
            Utils.hookArray();
            Utils.hookCRect();
            new Utils.controller();
            document.addEventListener("DOMContentLoaded", function(){
                let script = document.createElement('script');
                script.onload = function () {
                    Utils.initUI();
                };
                script.src = "https://unpkg.com/guify@0.12.0/lib/guify.min.js";

                document.body.appendChild(script);
            });

        },


    }

    Utils.LoadHack();


    WebSocket = class extends WebSocket{
        constructor(a){
            super(...arguments);
        }
        send(){
            let a = arguments;
            let that = this;
            setTimeout(function(){
                // this.super.send(...a)
            }.bind(this),Utils.settings.Lag/2);
            super.send(...a);
        }

        set onmessage(callback){
            const oldHook = callback;
            callback = function(e){
                let that = this;
                let a = arguments;
                setTimeout(function(){
                    return oldHook.apply(that, a);
                }, Utils.settings.Lag/2)

            }
            super.onmessage = callback;
        }
    }
})();
