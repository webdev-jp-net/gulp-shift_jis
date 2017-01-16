# gulp-shift_jis
gulpで、文字コードshift_jis、改行コードCR+LFを取り扱うサンプルです。

## ポイント
 * [gulp-convert-encoding](https://www.npmjs.com/package/gulp-convert-encodin)で文字コードを変更
 * [gulp-cr-lf-replace](https://www.npmjs.com/package/gulp-cr-lf-replace)で改行コードをCR+LFに変換

### SassでコンパイルされるCSSは @charset 'UTF-8';で固定されている
SassでコンパイルされるCSSは、[gulp-convert-encoding](https://www.npmjs.com/package/gulp-convert-encodin)を通しても```@charset 'UTF-8';```のまま残ってしまうので  
[gulp-replace](https://www.npmjs.com/package/gulp-replace)の文字列置換でshift_jisに書き換えます。
### Browsersyncはshift_jisが文字化けする
[Browsersync](https://browsersync.io)を使用すると、データを保存するとブラウザも更新してくれ非常に効率が良いのですが、文字コードがshift_jisのページを表示することができません。  
そこで、開発時はBrowsersyncを使うためutf-8で構築し、gulp releaseでソースを複製して納品用のshift_jisへ変換する対応としました。
### jQueryなどのライブラリ類の文字コードはshift_jisに変えたくない
gulp release実行時に、全てのデータの文字コードと改行コードを変換してしまうと、jQueryなどのライブラリデータも巻き込まれてしまいます。  
そこで、ライブラリは文字コード改行コード変換を対象とした複製からはいったん避けておき、あとで別個に複製する方法をとりました。
