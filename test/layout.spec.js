/**
* @jest-environment jsdom
*/

const fs = require('fs');
const { TestWatcher } = require('jest');
const html = fs.readFileSync(require.resolve('../index.html'), 'utf8');

describe('index.html', () => {
    beforeEach(() => {
        document.documentElement.innerHTML = html.toString();
    })

    describe('head', () => {
        
        it('has stylesheet', () => {
            let stylesheet = document.querySelector("head link[rel='stylesheet']");
            expect(stylesheet).toBeTruthy();
        });

        it('has favicon', () => {
            let icon = document.querySelector("head link[rel='shortcut icon']");
            expect(icon).toBeTruthy();
        });
        
        it('has "Home - Coderunner" as title', () => {
            let title = document.querySelector("head title");
            expect(title).toBeTruthy();
            expect(title.textContent).toBe('Home - Coderunner');
        });

        it('has a bootstrap script', () => {
            let script = document.querySelector('head script[src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"]');
            expect(script).toBeTruthy();
        }); 

        it('has a bundle script', () => {
            let script = document.querySelector("head script[src='./bundle.js']");
            expect(script).toBeTruthy();
        }); 
        
        it('has a defer property in the (first) script', () => {
            let script = document.querySelector('head script');
            expect(script).toBeTruthy();
            console.log(script.attributes[1].name);
            //expect(script.hasAttributes("defert")).toBeTrue; //it works but to finish off !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            });

    });

    describe('single post modal', () => {

    });

    describe('giphy modal', () => {

    });

    describe('nav bar', () => {
        test('has the heading of  </ coderunner>', () => {
            let coderunnerNav = document.querySelector("body nav a");
            expect(coderunnerNav).toBeTruthy();
            expect(coderunnerNav.textContent).toBe('</ coderunner>');

        })

        test('has the heading of  About', () => {
            let aboutNav = document.querySelector("body nav div div ul li a[href='#!']");
            expect(aboutNav).toBeTruthy();
            expect(aboutNav.textContent).toBe('About');

        })

        test('has the heading of  Github', () => {
            let githubNav = document.querySelector("body nav div div ul li a[href='#']");
            expect(githubNav).toBeTruthy();
            expect(githubNav.textContent).toBe('Github');

        })
        
        // test('has a dark background', () => {
        //     const colourBgDark = '#f8f9fa'
        //     let backgroundNav = document.querySelector('body nav[class="navbar-dark bg-dark"]');
            
        //     expect(backgroundNav).stylesheet(`background: ${colourBgDark}`);
        // });

    });

    describe('header', () => {

        test('has the heading Share your coding experience.', () => {
            let headingHeader = document.querySelector("body header h1");
            expect(headingHeader).toBeTruthy();
            expect(headingHeader.textContent).toBe('Share your coding experience.');

        })

        test('has the paragraph Anonymous platform for coders to share their stories.', () => {
            let paragraphHeader = document.querySelector("body header p");
            expect(paragraphHeader).toBeTruthy();
            expect(paragraphHeader.textContent).toContain('Anonymous platform for coders to share their stories.');

        })
    });

    describe('main content', () => {
        describe('info box', () => {

            
            test('has the heading What can I share?.', () => {
                let infoBoxHeadingMain = document.querySelector("body main div div section div[class='card-header']");
                expect(infoBoxHeadingMain).toBeTruthy();
                expect(infoBoxHeadingMain.textContent).toBe('What can I share?');
                
            })
            
            test('has the paragraph This platform is primarily for coders to anonymously share their experiences with other coders around the world.', () => {
                let infoBoxParagraphMain = document.querySelector("body main div div section div[class='card-body']");
                expect(infoBoxParagraphMain).toBeTruthy();
                expect(infoBoxParagraphMain.textContent).toContain('This platform is primarily for coders to anonymously share their experiences with other coders around the world');
    
            })
        });

        describe('post form', () => {

            test('What\'s on your mind?', () => {
                let formHeadingMain = document.querySelector("body main div div form h2");
                expect(formHeadingMain).toBeTruthy();
                expect(formHeadingMain.textContent).toBe('What\'s on your mind?');
                
            })
        });

        describe('posts', () => {

        });

        describe('pagination', () => {

        });
    });

    describe('footer', () => {

    });
});
