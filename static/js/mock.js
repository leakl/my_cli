define(['jq', 'mock'], function ($, Mock) {
  
    return {
        a: 'bbb',
        sub: function () {
         
            Mock.mock('/sub', {
                'list|1-10': [{
                    'name': (function(){
                        // var Random = Mock.Random;
                        return Mock.Random.csentence(1,5)
                    }()),
                    'id|1-100': 100,
                    children: [{
                        'name': '',
                        'id|1-100': 100
                    }]
                }]
            })
        }
    }
})