/**
 * Created by zhangrunfu on 17/10/9.
 */
(function () {
    function Stack() {
        this.dataStore = [];//保存栈内元素，初始化为一个空数组
        this.top = 0;//栈顶位置，初始化为0
        this.push = push;//入栈
        this.pop = pop;//出栈
        this.peek = peek;//查看栈顶元素
        this.clear = clear;//清空栈
        this.length = length;//栈内存放元素的个数
    };
    
    Stack.prototype.push = function (element) {
        this.dataStore[this.top++] = element;
    };
    
    Stack.prototype.pop = function () {
        return this.dataStore[--this.top];
    };
    
    Stack.prototype.peek = function () {
        return this.dataStore[this.top-1];
    };

    Stack.prototype.clear = function () {
        this.top = 0;
    };

    Stack.prototype.length = function () {
        return this.top;
    };
    Stack.prototype.isEmpty = function () {
        return this.top >0;
    };

    if (typeof window === "object" && typeof window.document === "object") {
        window.Stack = Stack;
    }
})();