snake, Bach 404 edition
=====
Collect all the notes to help Bach write a Sonata! It's fun snake game but with with that classic 8 bit sound. To use it as a 404 page, take the file 404.html in the `dist` folder and place it wherever you want it (cloudfront, your server, etc.). It has all the necessary files all crammed and minified/base64'd rigt into the html file. 

One fun part of this lil' project was writing the note interpreter function that takes in an array of notes in the format `Ab5` and plays the correct frequency on the oscillator. I had to learn a little about how frequency relates to note values  :D

### Develop
Clone the repo, then:
```
npm install
gulp develop
```
To build an updated `404.html`, run `gulp release`.

