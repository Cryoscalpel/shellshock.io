const WebSocket = require('ws');

Math.mod = (e,t)=>{var r=e%t;return r>=0?r:r+t};

let ut = function(e, t) {
    this.size = 0,
    this.originalSize = t,
    this.constructorFn = e,
    this.objects = [],
    this.idx = 0,
    this.numActive = 0,
    this.expand(t)
}
ut.prototype.expand = function(e) {
    for (var t = 0; t < e; t++) {
        var r = this.constructorFn();
        r.id = t + this.size,
        r.active = !1,
        this.objects.push(r)
    }
    this.size += e
}
ut.prototype.retrieve = function(e) {
    if (null != e) {
        for (; e >= this.size; )
            this.expand(this.originalSize);
        return this.numActive++,
        this.objects[e].active = !0,
        this.objects[e]
    }
    var t = this.idx;
    do {
        t = (t + 1) % this.size;
        var r = this.objects[t];
        if (!r.active)
            return this.idx = t,
            this.numActive++,
            r.active = !0,
            r
    } while (t != this.idx);return this.expand(this.originalSize),
    console.log("Expanding pool for: " + this.objects[0].constructor.name + " to: " + this.size),
    this.retrieve()
}
ut.prototype.recycle = function(e) {
    e.active = !1,
    this.numActive--
}
ut.prototype.forEachActive = function(e) {
    for (var t = 0; t < this.size; t++) {
        var r = this.objects[t];
        !0 === r.active && e(r, t)
    }
}
var Vt = {
    buffer: null,
    bufferPool: new ut((function() {
        return new kt(2048)
    }
    ),2),
    getBuffer: function() {
        var e = this.bufferPool.retrieve();
        return e.idx = 0,
        e
    }
};
function kt(e) {
    this.idx = 0,
    this.arrayBuffer = new ArrayBuffer(e),
    this.buffer = new Uint8Array(this.arrayBuffer,0,e)
}
kt.prototype.send = function(e) {
    var t = new Uint8Array(this.arrayBuffer,0,this.idx);
    e.send(t),
    Vt.bufferPool.recycle(this)
}
kt.prototype.packInt8 = function(e) {
    this.buffer[this.idx] = 255 & e,
    this.idx++
}
kt.prototype.packInt16 = function(e) {
    this.buffer[this.idx] = 255 & e,
    this.buffer[this.idx + 1] = e >> 8 & 255,
    this.idx += 2
}
kt.prototype.packInt32 = function(e) {
    this.buffer[this.idx] = 255 & e,
    this.buffer[this.idx + 1] = e >> 8 & 255,
    this.buffer[this.idx + 2] = e >> 16 & 255,
    this.buffer[this.idx + 3] = e >> 24 & 255,
    this.idx += 4
}
kt.prototype.packRadU = function(e) {
    this.packInt16(1e4 * e)
}
kt.prototype.packRad = function(e) {
    this.packInt16(1e4 * (e + Math.PI))
}
kt.prototype.packFloat = function(e) {
    this.packInt16(300 * e)
}
kt.prototype.packDouble = function(e) {
    this.packInt32(1e6 * e)
}
kt.prototype.packString = function(e) {
    this.packInt8(e.length);
    for (var t = 0; t < e.length; t++)
        this.packInt16(e.charCodeAt(t))
}
var Ut = {
    buffer: null,
    idx: 0,
    init: function(e) {
        this.buffer = new Uint8Array(e),
        this.idx = 0
    },
    isMoreDataAvailable: function() {
        return Math.max(0, this.buffer.length - this.idx)
    },
    unPackInt8U: function() {
        var e = this.idx;
        return this.idx++,
        this.buffer[e]
    },
    unPackInt8: function() {
        return (this.unPackInt8U() + 128) % 256 - 128
    },
    unPackInt16U: function() {
        var e = this.idx;
        return this.idx += 2,
        this.buffer[e] + (this.buffer[e + 1] << 8)
    },
    unPackInt32U: function() {
        var e = this.idx;
        return this.idx += 4,
        this.buffer[e] + 256 * this.buffer[e + 1] + 65536 * this.buffer[e + 2] + 16777216 * this.buffer[e + 3]
    },
    unPackInt16: function() {
        return (this.unPackInt16U() + 32768) % 65536 - 32768
    },
    unPackInt32: function() {
        return (this.unPackInt32U() + 2147483648) % 4294967296 - 2147483648
    },
    unPackRadU: function() {
        return this.unPackInt16U() / 1e4
    },
    unPackRad: function() {
        return this.unPackRadU() - Math.PI
    },
    unPackFloat: function() {
        return this.unPackInt16() / 300
    },
    unPackDouble: function() {
        return this.unPackInt32() / 1e6
    },
    unPackString: function(e) {
        e = e || 1e3;
        var t = Math.min(this.unPackInt8U(), e);
        if (!(this.isMoreDataAvailable() < t)) {
            for (var r = new String, i = 0; i < t; i++) {
                var n = this.unPackInt16U();
                n > 0 && (r += String.fromCharCode(n))
            }
            return r
        }
    }
}


He = {
    gameJoined: 0,
    addPlayer: 1,
    removePlayer: 2,
    chat: 3,
    controlKeys: 4,
    keyUp: 5,
    syncThem: 6,
    jump: 7,
    die: 8,
    hitThem: 9,
    hitMe: 10,
    collectItem: 11,
    spawnItem: 12,
    respawn: 13,
    swapWeapon: 14,
    joinGame: 15,
    ping: 16,
    pong: 17,
    clientReady: 18,
    requestRespawn: 19,
    joinPublicGame: 21,
    joinPrivateGame: 22,
    createPrivateGame: 23,
    switchTeam: 25,
    notification: 26,
    changeCharacter: 27,
    playerCount: 28,
    pause: 30,
    announcement: 31,
    updateBalance: 32,
    reload: 33,
    refreshGameState: 34,
    switchTeamFail: 35,
    expireUpgrade: 36,
    bootPlayer: 37,
    loginRequired: 38,
    banned: 39,
    gameLocked: 40,
    bootPlayer: 42,
    banned: 43,
    spatula: 44,
    syncMe: 45,
    explode: 46,
    keepAlive: 47,
    startReload: 49,
    fire: 50,
    throwGrenade: 51,
    info: 255,
    videoReward: 58,
    eventModifier: 63
}

let Utils = {

    handshake: (caller)=>{

        var r = Vt.getBuffer();
        r.packInt8(He.joinGame),
        r.packInt8(0),
        r.packInt8(He.joinPublicGame),
        r.packInt8(0),
        r.packInt8(null),
        r.packInt16(null), //game id
        r.packInt16(null), //game key
        r.packInt8(0),
        r.packInt8(0),
        r.packInt8(0),
        r.packInt8(0),
        r.packInt8(0),
        r.packInt8(0),
        r.packString(caller.player.playerName),
        r.send(caller.ws)

    },

    player: {x:0,y:0,z:0, id:-1},


    entities: new Map(),


    clientReady: (caller)=>{
        var READY_PACKET = Vt.getBuffer();
        READY_PACKET.packInt8(He.clientReady);
        READY_PACKET.send(caller.ws);
    },

    respawn: (caller, timeout)=>{
        setTimeout(function(){

            var READY_PACKET = Vt.getBuffer();
            READY_PACKET.packInt8(He.requestRespawn);
            READY_PACKET.send(caller.ws);

            console.log('Requested Respawn');
        },timeout)
        
            
    },

    ping: (caller)=>{

        setInterval(function(){

            var PING_PACKET = Vt.getBuffer();
                PING_PACKET.packInt8(He.ping);
                PING_PACKET.send(caller.ws);
                Utils.respawn(caller, 2000);

        },1000)


        setInterval(function(){
            let nearestPlayer = Utils.getNearest(caller);
                if(nearestPlayer){
                    Utils.calcAngle(caller, nearestPlayer);
                }else{
                    console.log('Got no player')
                }

                Utils.sendUpdate(caller);
        }, 100)

    },

    chat: (caller, message)=>{
        var chat = Vt.getBuffer();
            chat.packInt8(He.chat),
            chat.packString(`${chat} ${Math.random()*100}`)
            chat.send(caller.ws);
    },

    sendUpdate: (caller)=>{
        let Xe = Math.ceil(3);
        let ct = 256;

        caller.player.stateIdx = Math.mod(caller.player.stateIdx + 1, ct);

        var e = Vt.getBuffer();
        e.packInt8(He.syncMe),
        e.packInt8(Math.mod(caller.player.stateIdx - Xe, ct)),
        e.packInt8(caller.player.serverStateIdx);
        for (var t = Math.mod(caller.player.stateIdx - Xe, ct), r = 0; r < Xe; r++) {
            var i = Math.mod(t + r, ct);
            e.packInt8(1), //control keys
            e.packInt8(0), //shots
            e.packRadU(caller.player.yaw), //yaw
            e.packRad(caller.player.pitch) //pitch
        }
        e.send(caller.ws)
            
        

    },

    calcDist2d: (p1,p2) => {
        return Math.sqrt(  (p1.x-p2.x)**2 + (p1.y-p2.y)**2);
    },

    getNearest: (caller)=>{
        let nearest = {player:null, dist: null};
        Utils.entities.forEach((player, id) => {
            if(Date.now() - player.ts > 2000){
                Utils.entities.delete(id);
            }else{
                let dist = Utils.calcDist2d(caller.player, player);
                if(!nearest.dist || dist < nearest.dist){
                    nearest.dist = dist;
                    nearest.player = player;
                }
            }   
        })
        return nearest.player || false;
    },

    getTargetAngle: function(angle){
        if (angle < 0) angle += Math.PI * 2;
        if (angle < 0) angle += Math.PI * 2;
        if (angle < 0) angle += Math.PI * 2;
        if (angle - Math.PI * 2 > 0) angle -= Math.PI * 2;
        if (angle - Math.PI * 2 > 0) angle -= Math.PI * 2;
        if (angle - Math.PI * 2 > 0) angle -= Math.PI * 2;
        return angle;
    },

    getTargetDelta: function(caller, player2){
        return {x: caller.player.x - (player2.x),
                y: caller.player.y - (player2.y),
                z: caller.player.z - (player2.z),
               };
    },

    calcAngle: function(caller, target) {
        const delta = Utils.getTargetDelta(caller, target);
        let dif_pitch = Math.atan2(delta.y, Math.sqrt(delta.x * delta.x + delta.z * delta.z));
        let dif_yaw = Utils.getTargetAngle(-Math.PI/2 - Math.atan2(delta.z, delta.x));
        caller.player.pitch  = dif_pitch;
        caller.player.yaw  = dif_yaw;
    },

    handlePacket: (packet, caller)=>{

    
        switch (Ut.init(packet),
            Fn = Ut.unPackInt8U()) {
            case He.gameJoined:

                Utils.clientReady(caller);
                Utils.respawn(caller, 2000);
                Utils.ping(caller);
                console.log("CommCode.gameJoined received")
                break;
            case He.syncThem:

                let id = Ut.unPackInt8U();
                x = Ut.unPackFloat(),
                y = Ut.unPackFloat(),
                z = Ut.unPackFloat(),
                //console.log(id,x,y,z);
                Utils.entities.set(id, {x:x, y:y, z:z, ts:Date.now()});
                break;
            case He.syncMe:
                let botID = Ut.unPackInt8U();
                let botSomething = Ut.unPackInt8U();
                let botJ = Ut.unPackInt8U();
                let botX = Ut.unPackFloat();
                let botY = Ut.unPackFloat();
                let botZ = Ut.unPackFloat();

                caller.player.x = botX;
                caller.player.y = botY;
                caller.player.z = botZ;
                caller.player.id = botID;
                caller.player.serverStateIdx = botJ;
                //console.log(caller.player.x, caller.player.y, caller.player.z)

                
                
                //console.log(caller.player.pitch, caller.player.yaw);
                break;
            default:
                
                //console.log(Fn);
                break
        }

    }


}

class Bot{
    constructor(url){
        this.url = url;

        this.player = {
            stateIdx: 0,
            playerName: "I am a bot",
            stateBuffer: [],
            serverStateIdx:0,
            x:0,
            y:0,
            z:0,
        }

        this.ws = new WebSocket(this.url);

        let that = this;
        this.ws.on('open', function(e){
            console.log('Connection Established');

            Utils.handshake(that);
        })


        this.ws.on('message', function(e){
            Utils.handlePacket(e, that);
        })

        this.ws.on('close', function(e){
            console.log('Conenction Termiated');
        })
    }
}
for(var i = 0 ;i <4; i++){
    new Bot('wss://sydney.shellshock.io')
}
