 <script type="text/javascript" src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=default">
 </script>

# com.HCI.ColorMixer  
有一种（不好意思又给这个世界增加垃圾代码）了的感觉  

左键在面板上取点，颜色对应到前景色  
右键选择小球，小球的颜色显示在下方，对应背景色。可以通过调整背景色来调整小球的颜色。  
选中小球之后用滚轮移动缩放小球  
 

然后那堆杂七杂八的图层都是最好不要去动的……

TODO 
有部分的交互还不够自然  
然后可以减少一些不需要的重新计算（比如选择颜色）

还缺一块历史记录我看心情吧= =    

哦还有关闭之后后台运行？


setback 
因为没有办法读取具体的每个像素的alpha，所以透明的图层的处理会有问题，一旦有alpha就会凉
所以并不指望它会变成一个可用的软件

让我测一下公式
1  
\x=\frac{-b\pm\sqrt{b^2-4ac}}{2a}\
2  
$$x=\frac{-b\pm\sqrt{b^2-4ac}}{2a}$$
3  $x=\frac{-b\pm\sqrt{b^2-4ac}}{2a}$