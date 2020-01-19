class Queue 
{

    constructor()
    {
        this.items = [];
    }

    enqueue(element)
    {
        this.items.push(element);
    }

    dequeue()
    {
        return this.items.shift();
    }

    empty()
    {
        return this.items.length === 0;
    }

    size()
    {
        return this.items.length;
    }

    peek()
    {
        if (this.empty())
        {
            return null;
        }
        item = this.dequeue();
        this.items.unshift(item);

        return item;
    }
    
}

module.exports = Queue;