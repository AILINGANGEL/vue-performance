class RequestPool {
    constructor(poolCount) {
        this.poolCount = poolCount;
        this.count = 0;
        this.queue = [];
    }
    request(){
        if(this.count < this.poolCount && this.queue.length) {
            const { url, resolve, reject } = this.queue.shift()
            this.count++;
            fetch(url).then(response => resolve(response.url))
            .catch((...args) => reject(...args))
            .finally(() => {
                this.count--;
                this.request()
            });
        }
    }
    requestImg(url) {
        return new Promise((resolve, reject) => {
            this.queue.push({ url, resolve, reject })
            this.request()
        });
    }
    getQueue(){
        return this.queue;
    }
    restart(queue){
        this.queue = queue;
        let i = 0;
        while(i < this.poolCount) {
            this.request();
            i++;
        }
    }
}

export default RequestPool;