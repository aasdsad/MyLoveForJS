(function () {
    var moduleMap = {};//模块存储器
    var fileMap = {};
 
    var noop = function () {
    };
 
    var thin = {
        /*
        @description:定义模块
        @param
        name:string,
        depemdencies:object,
        factory:function
        */
        define: function(name, dependencies, factory) {
            if (!moduleMap[name]) {
                var module = {
                    name: name,
                    dependencies: dependencies,
                    factory: factory
                };
 
                moduleMap[name] = module;
            }
 
            return moduleMap[name];
        },
        /*
        @description:使用模块
        @param
        name:string
        */
        use: function(name) {
            
            var module = moduleMap[name];
 
            if (!module.entity) {//如果模块没有执行过（即没有缓存在entnty上）
                var args = [];
                for (var i=0; i<module.dependencies.length; i++) {//遍历依赖
                    if (moduleMap[module.dependencies[i]].entity) {//如果模块没有执行过（即没有缓存在entnty上）
                        args.push(moduleMap[module.dependencies[i]].entity);
                    }
                    else {
                        args.push(this.use(module.dependencies[i]));
                    }
                }
 
                module.entity = module.factory.apply(noop, args);//缓存在entity上
            }
 
            return module.entity;
        },
 
        require: function (pathArr, callback) {
            for (var i = 0; i < pathArr.length; i++) {
                var path = pathArr[i];
 
                if (!fileMap[path]) {
                    var head = document.getElementsByTagName('head')[0];
                    var node = document.createElement('script');
                    node.type = 'text/javascript';
                    node.async = 'true';
                    node.src = path + '.js';
                    node.onload = function () {
                        fileMap[path] = true;
                        head.removeChild(node);
                        checkAllFiles();
                    };
                    head.appendChild(node);
                }
            }
 
            function checkAllFiles() {
                var allLoaded = true;
                for (var i = 0; i < pathArr.length; i++) {
                    if (!fileMap[pathArr[i]]) {
                        allLoaded = false;
                        break;
                    }
                }
 
                if (allLoaded) {
                    callback();
                }
            }
        }
    };
 
    window.thin = thin;
})();