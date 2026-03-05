# Content from https://docs.originality.ai/credit-balance-copy-1

Scan

## Sections

- [Documentation](https://docs.originality.ai/originality-ai-api-v1)
- [POST\\
Scan](https://docs.originality.ai/scan)
- [POST\\
Batch Scan](https://docs.originality.ai/batch-scan-1)
- [POST\\
Scan Url](https://docs.originality.ai/scan-url)
- [GET\\
Credit Balance](https://docs.originality.ai/credit-balance-copy-1)
- [GET\\
Scan Results](https://docs.originality.ai/scan-results-copy-1)

Search

Version 3

Open menu

Version 3

Theme switcher

# Documentation

Explore our guides and examples to integrate [Originality.ai](https://originality.ai/) into your workflows

###### 1

### First step

[Create](https://app.originality.ai/signup) or [Login](https://app.originality.ai/login) to [Originality.ai](https://originality.ai/) and subscribe to our [Enterprise](https://originality.ai/pricing) level plan

###### 2

### Create API Key

Create an api key for use here: [https://app.originality.ai/home/api-token-dashboard](https://%20https//app.originality.ai/home/api-token-dashboard)

###### 3

### Prepare Requests

All requests must contain the following header

Key

Value

|     |     |
| --- | --- |
| X-OAI-API-KEY | your-api-key |

# Important Information

### Rate Limit

The rate limit for our api is 500 requests per minute. Your remaining limit for the current minute can be found by examining the response headers after a request has completed. In the event you have reached the upper limit, a 429 “too many requests” error will be returned by our system

### Auto Credit Top-up

By default, [Originality.ai](https://originality.ai/) accounts are set to automatically top up credits when they fall low. This means that if you've exhausted your [originality.ai](https://originality.ai/) credits while using the api, credits will be automatically purchased using your default payment method on file. This is to ensure smooth operating of your workflows. You can manage your top up settings anytime here: [https://app.originality.ai/home/account#topup](https://app.originality.ai/home/account#topup)

Tips to avoid unwanted credit card charges

Title

|     |
| --- |
| a) Reduce request concurrency |
| b) Adjust Auto top up settings (disable, +/- threshold) |
| c) Manually purchase credits - [https://app.originality.ai/home/credits/purchase](https://app.originality.ai/home/credits/purchase) |

# Scan Features

This page outlines the scan features you can use to check your content

## [**AI Checker**](https://originality.ai/)

For the most accurate scoring provide plain text into the api when initiating a new scan

Models

Title

Description

Title

Description

|     |     |     |     |
| --- | --- | --- | --- |
| Version | String for Scan Request | Description | Tags |
| Lite - 1.0.0 | “lite” | Under 1% False Positive rate. Use when you want to allow some use of AI for editing. Best for academia. | Lightly AI-edited content is acceptable |
| Turbo - 3.0.2 | “turbo” | Under 5% False Positive rate. most accurate AI detector that is very hard to bypass. Use when you want to be certain AI was not used. [Learn more](https://originality.ai/ai-content-detection-accuracy/). | Effective on the latest LLMs including GPT-4o, ChatGPT, Gemini Pro, Claude 3 and popular open-source models such as Llama 3. |
| Multi-Language | “multilang” | Our standard model that supports languages other than English. | Russian, Spanish, Turkish, Italian, French, German, Portuguese, Dutch, Chinese (Mandarin), Greek, Polish, Vietnamese, Japanese, Persian |
| Lite - 1.0.2 | “lite-102” | Latest Beta Version of the Lite Model | Lightly AI-edited content is acceptable |
| Academic 0.0.5 | “academic” | Ideal for teachers and students |  |

## [**Plagiarism Checker**](https://originality.ai/plagiarism-checker)

Use our plagiarism features to protect your reputation & improve your content quality by accurately detecting plagiarism content. Our plagiarism feature uses advanced machine learning to accurately detect plagiarism. It is designed to detect complex forms of plagiarism such as patchwork, unintentional, mosaic plagiarism and more!

When enabling this feature on a new scan request, it will extend the length of time it takes to get a response from the API. Depending on the size of content submitted, it could take up to 60 seconds to process. If you are experiencing timeouts when running a plagiarism check you can split the content into multiple chunks and run them separately.

## [**Readability Checker**](https://originality.ai/readability-checker)

Use our readability feature to help ensure that your writing isn't too complex for your readers. By giving you an approximate grade level / score, you can ensure that your content is easily understood by your target audience and they're getting the most value possible out of the information you're sharing

## **Grammar & Spelling Checker**

Use our Grammar checker to check for any grammatical, spelling, and punctuation errors. Regardless of what you are writing, you have to make sure your piece is without any mistakes.

**Fact Checker:**
Our Automated Fact-Checker verifies your content in real time, flagging potential inaccuracies and providing clear justifications with trusted source links. Designed for publishers, agencies, and writers, it helps you maintain impeccable credibility in an era of evolving AI-generated text.

**SEO Content Optimization:**
Our Content Optimizer delivers a precise, cheat-resistant quality score that predicts how well your content will rank on Google. Use it to assess your page’s SEO performance and access actionable recommendations that boost overall content quality.

Was this section helpful?Yes

No

### What made this section unhelpful for you?

Confusing or unclear information

Incorrect or outdated information

Incomplete information or samples

Other

CancelSubmit

# Scan

Run a new scan on your content. Check for AI Detection, Plagiarism, Factual Claims, Readability, Grammar/Spelling and Content Optimization

#### Header Parameters

X-OAI-API-KEYstring Required

Your API key

#### Body ParametersExpand all

titlestring Required

a title to help you identify your scan

check\_aiboolean Required

Check for AI

check\_plagiarismboolean Required

Check for Plagiarism

check\_factsboolean Required

Check for Factual Accuracy

check\_readabilityboolean Required

Check Readability Scores

check\_grammarboolean Required

Check Grammar & Spelling

check\_contentOptimizerboolean Required

Check Content Optimization

optimizerQuerystring Required

Keyword or phrase you want your content to rank for

optimizerCountrystring Required

"United States" - only the United States is supported at this time

optimizerDevicestring Required

"desktop" or "mobile"

optimizerPublishingDomainstring Required

optional - enter the url of the website where this content will be published. This helps our AI analyze keyword relevance, back links, and content performance which can improve ranking predictions

storeScanboolean Required

Set to false if you don't want your scan stored for access later. Warning - setting this to false will prevent you from viewing the results again

excludedUrlsarray

Show child attributes

aiModelVersionstring Required

what AI model to use for AI detection. "lite", "turbo", "multilang"

contentstring Required

The PLAIN TEXT content you want to scan

### ResponseExpand all

200

Object

#### Response Attributes

resultsobject

Show child attributes

Was this section helpful?Yes

No

### What made this section unhelpful for you?

Confusing or unclear information

Incorrect or outdated information

Incomplete information or samples

Other

CancelSubmit

Base URL

Version 3:

https://api.originality.ai/api/v3

POST

/scan

cURL

`1curl --location 'http://example.io/scan' \
2--header 'X-OAI-API-KEY: your-api-key' \
3--data '{
4  "title": "My API Scan",
5  "check_ai": true,
6  "check_plagiarism": true,
7  "check_facts": true,
8  "check_readability": true,
9  "check_grammar": true,
10  "check_contentOptimizer": true,
11  "optimizerQuery": "Mobile Hotspot",
12  "optimizerCountry": "United States",
13  "optimizerDevice": "Desktop",
14  "optimizerPublishingDomain": "https://www.cnet.com/home/internet/i-tried-using-my-mobile-hotspot-at-home-heres-everything-that-went-wrong/",
15  "storeScan": true,
16  "excludedUrls": [\
17    "https://example-1.com",\
18    "https://example-2.com"\
19  ],
20  "aiModelVersion": "lite",
21  "content": "I didn’t realize how convenient it is to stay connected by using my phone as a mobile hotspot until I found myself without service in New York City on a random Thursday last year. On my way to the office, I used my cellphone to work on the train. But shortly after I exited the train station, like many other AT&T users who experienced a sudden network outage, I had no service or access to 5G internet data. It took me a few visits to different coffee shops in the area to finally find free Wi-Fi I could connect to. After finally finding a place that allowed me to use their public Wi-Fi, I texted my family and let them know that they wouldn’t be able to contact me until I reached the office, which was still a ways away."
22}'`

#### Response

200

```
{
  "results": {
    "properties": {
      "privateID": 30137337,
      "id": "removed from response",
      "title": "My API Scan",
      "excludedUrls": [\
        "https://example-1.com",\
        "https://example-2.com"\
      ],
      "publicLink": "removed from response",
      "content": "I didn’t realize how convenient it is to stay connected by using my phone as a mobile hotspot until I found myself without service in New York City on a random Thursday last year. On my way to the office, I used my cellphone to work on the train. But shortly after I exited the train station, like many other AT&T users who experienced a sudden network outage, I had no service or access to 5G internet data. It took me a few visits to different coffee shops in the area to finally find free Wi-Fi I could connect to. After finally finding a place that allowed me to use their public Wi-Fi, I texted my family and let them know that they wouldn’t be able to contact me until I reached the office, which was still a ways away.",
      "formattedContent": "I didn’t realize how convenient it is to stay connected by using my phone as a mobile hotspot until I found myself without service in New York City on a random Thursday last year. On my way to the office, I used my cellphone to work on the train. But shortly after I exited the train station, like many other AT&T users who experienced a sudden network outage, I had no service or access to 5G internet data. It took me a few visits to different coffee shops in the area to finally find free Wi-Fi I could connect to. After finally finding a place that allowed me to use their public Wi-Fi, I texted my family and let them know that they wouldn’t be able to contact me until I reached the office, which was still a ways away."
    },
    "credits": {
      "used": 9
    },
    "ai": {
      "aiModel": "lite",
      "classification": {
        "AI": 1,
        "Original": 0
      },
      "confidence": {
        "AI": 0.9526,
        "Original": 0.0474
      },
      "blocks": [\
        {\
          "text": "I didn’t realize how convenient it is to stay connected by using my phone as a mobile hotspot until I found myself without service in New York City on a random Thursday last year. ",\
          "result": {\
            "fake": 0.9456973173429567,\
            "real": 0.0543026826570433,\
            "status": "success"\
          }\
        },\
        {\
          "text": "On my way to the office, I used my cellphone to work on the train. ",\
          "result": {\
            "fake": 0.9320012428571779,\
            "real": 0.06799875714282211,\
            "status": "success"\
          }\
        },\
        {\
          "text": "But shortly after I exited the train station, like many other AT&T users who experienced a sudden network outage, I had no service or access to 5G internet data. ",\
          "result": {\
            "fake": 0.9494822880337634,\
            "real": 0.050517711966236556,\
            "status": "success"\
          }\
        },\
        {\
          "text": "It took me a few visits to different coffee shops in the area to finally find free Wi-Fi I could connect to. ",\
          "result": {\
            "fake": 0.9513747733791668,\
            "real": 0.04862522662083324,\
            "status": "success"\
          }\
        },\
        {\
          "text": "After finally finding a place that allowed me to use their public Wi-Fi, I texted my family and let them know that they wouldn’t be able to contact me until I reached the office, which was still a ways away.",\
          "result": {\
            "fake": 0.9844443783869344,\
            "real": 0.015555621613065562,\
            "status": "success"\
          }\
        }\
      ]
    },
    "plagiarism": {
      "score": 100,
      "results": [\
        {\
          "phrase": "I didn't realize how convenient it is to stay connected by using my phone as a mobile hotspot until I found myself without service in New York City on a random Thursday last year.",\
          "results": [\
            {\
              "link": "https://www.cnet.com/home/internet/i-tried-using-my-mobile-hotspot-at-home-heres-everything-that-went-wrong/",\
              "title": "I Tried Using My Mobile Hotspot at Home. Here's Everything ... - CNET",\
              "scores": [\
                {\
                  "score": 1,\
                  "sentence": "I didn’t realize how convenient it is to stay connected by using my phone as a mobile hotspot until I found myself without service in New York City on a random Thursday last year.?"\
                }\
              ]\
            }\
          ]\
        },\
        {\
          "phrase": "On my way to the office, I used my cellphone to work on the train.",\
          "results": [\
            {\
              "link": "https://www.cnet.com/home/internet/i-tried-using-my-mobile-hotspot-at-home-heres-everything-that-went-wrong/",\
              "title": "I Tried Using My Mobile Hotspot at Home. Here's Everything ... - CNET",\
              "scores": [\
                {\
                  "score": 1,\
                  "sentence": "On my way to the office, I used my cellphone to work on the train."\
                }\
              ]\
            }\
          ]\
        },\
        {\
          "phrase": "But shortly after I exited the train station, like many other AT&T users who experienced a sudden network outage, I had no service or access to 5G internet data.",\
          "results": [\
            {\
              "link": "https://www.cnet.com/home/internet/i-tried-using-my-mobile-hotspot-at-home-heres-everything-that-went-wrong/",\
              "title": "I Tried Using My Mobile Hotspot at Home. Here's Everything ... - CNET",\
              "scores": [\
                {\
                  "score": 1,\
                  "sentence": "But shortly after I exited the train station, like many other AT&T users who experienced a sudden network outage, I had no service or access to 5G internet data.?"\
                }\
              ]\
            }\
          ]\
        },\
        {\
          "phrase": "It took me a few visits to different coffee shops in the area to finally find free Wi-Fi I could connect to.",\
          "results": [\
            {\
              "link": "https://www.cnet.com/home/internet/i-tried-using-my-mobile-hotspot-at-home-heres-everything-that-went-wrong/",\
              "title": "I Tried Using My Mobile Hotspot at Home. Here's Everything ... - CNET",\
              "scores": [\
                {\
                  "score": 1,\
                  "sentence": "It took me a few visits to different coffee shops in the area to finally find free Wi-Fi I could connect to."\
                }\
              ]\
            }\
          ]\
        },\
        {\
          "phrase": "After finally finding a place that allowed me to use their public Wi-Fi, I texted my family and let them know that they wouldn't be able to contact me until I reached the office, which was still a ways away.",\
          "results": [\
            {\
              "link": "https://www.cnet.com/home/internet/i-tried-using-my-mobile-hotspot-at-home-heres-everything-that-went-wrong/",\
              "title": "I Tried Using My Mobile Hotspot at Home. Here's Everything ... - CNET",\
              "scores": [\
                {\
                  "score": 1.0000000000000002,\
                  "sentence": "After finally finding a place that allowed me to use their public Wi-Fi, I texted my family and let them know that they wouldn’t be able to contact me until I reached the office, which was still a ways away.?"\
                }\
              ]\
            }\
          ]\
        }\
      ]
    },
    "facts": [\
      {\
        "fact": "I didn’t realize how convenient it is to stay connected by using my phone as a mobile hotspot until I found myself without service in New York City on a random Thursday last year.",\
        "truthfulness": "0%",\
        "explanation": "This statement is subjective and personal, so it cannot be fact-checked for truthfulness. However, it does not contain any verifiable factual claims.",\
        "links": []\
      },\
      {\
        "fact": "On my way to the office, I used my cellphone to work on the train.",\
        "truthfulness": "0%",\
        "explanation": "This statement is personal and subjective, lacking verifiable factual content.",\
        "links": []\
      },\
      {\
        "fact": "But shortly after I exited the train station, like many other AT&T users who experienced a sudden network outage, I had no service or access to 5G internet data.",\
        "truthfulness": "50%",\
        "explanation": "There was a significant AT&T network outage in 2024, but the specific timing and location (New York City) in the narrative are not verified by the available sources. The outage did affect many AT&T users nationwide.",\
        "links": [\
          "[1]",\
          "[2]"\
        ]\
      },\
      {\
        "fact": "It took me a few visits to different coffee shops in the area to finally find free Wi-Fi I could connect to.",\
        "truthfulness": "0%",\
        "explanation": "This statement is personal and lacks verifiable factual content.",\
        "links": []\
      },\
      {\
        "fact": "After finally finding a place that allowed me to use their public Wi-Fi, I texted my family and let them know that they wouldn’t be able to contact me until I reached the office, which was still a ways away.",\
        "truthfulness": "0%",\
        "explanation": "This statement is personal and subjective, lacking verifiable factual content.",\
        "links": []\
      }\
    ],
    "readability": {
      "text_stats": {
        "letterCount": 573,
        "sentenceCount": 5,
        "uniqueWordCount": 101,
        "syllableCount": 197,
        "totalSyllables": 206,
        "averageSyllablesPerWord": 1.44,
        "wordsWithThreeSyllables": 11,
        "percentWordsWithThreeSyllables": 7.69,
        "longestSentence": "after finally finding a place that allowed me to use their public Wi Fi I texted my family and let them know that they wouldn't be able to contact me until I reached the office which was still a ways away. ",
        "paragraphCount": 1,
        "averageSpeakingTime": 1.1,
        "averageReadingTime": 0.5,
        "averageWritingTime": 3.6
      },
      "readability": {
        "fleschReadingEase": 56,
        "fleschGradeLevel": 12,
        "gunningFoxIndex": 14.5,
        "smogIndex": 11.7,
        "powersSumnerKearl": 7,
        "forcastGradeLevel": 10.9,
        "colemanLiauIndex": 7.8,
        "automatedReadabilityIndex": 11.7,
        "daleChallReadabilityGrade": 4.7,
        "spacheReadabilityGrade": 5,
        "linsearWriteGrade": 11.6
      },
      "sentences": [\
        {\
          "phrase": "I didn’t realize how convenient it is to stay connected by using my phone as a mobile hotspot until I found myself without service in New York City on a random Thursday last year.",\
          "cleanPhrase": "I didn’t realize how convenient it is to stay connected by using my phone as a mobile hotspot until I found myself without service in New York City on a random Thursday last year ",\
          "isVeryHard": true,\
          "isHard": false,\
          "wordsOver13Chars": [],\
          "wordsOver4Syllables": [],\
          "adverbs": []\
        },\
        {\
          "phrase": "On my way to the office, I used my cellphone to work on the train.",\
          "cleanPhrase": "On my way to the office  I used my cellphone to work on the train ",\
          "isVeryHard": false,\
          "isHard": true,\
          "wordsOver13Chars": [],\
          "wordsOver4Syllables": [],\
          "adverbs": []\
        },\
        {\
          "phrase": "But shortly after I exited the train station, like many other AT&T users who experienced a sudden network outage, I had no service or access to 5G internet data.",\
          "cleanPhrase": "But shortly after I exited the train station  like many other AT& T users who experienced a sudden network outage  I had no service or access to 5G internet data ",\
          "isVeryHard": true,\
          "isHard": false,\
          "wordsOver13Chars": [],\
          "wordsOver4Syllables": [],\
          "adverbs": []\
        },\
        {\
          "phrase": "It took me a few visits to different coffee shops in the area to finally find free Wi-Fi I could connect to.",\
          "cleanPhrase": "It took me a few visits to different coffee shops in the area to finally find free Wi Fi I could connect to ",\
          "isVeryHard": false,\
          "isHard": true,\
          "wordsOver13Chars": [],\
          "wordsOver4Syllables": [],\
          "adverbs": []\
        },\
        {\
          "phrase": "After finally finding a place that allowed me to use their public Wi-Fi, I texted my family and let them know that they wouldn’t be able to contact me until I reached the office, which was still a ways away.",\
          "cleanPhrase": "After finally finding a place that allowed me to use their public Wi Fi  I texted my family and let them know that they wouldn’t be able to contact me until I reached the office  which was still a ways away ",\
          "isVeryHard": true,\
          "isHard": false,\
          "wordsOver13Chars": [],\
          "wordsOver4Syllables": [],\
          "adverbs": []\
        }\
      ]
    },
    "grammarSpelling": {
      "matches": [\
        {\
          "message": "Possible spelling mistake found.",\
          "shortMessage": "Spelling mistake",\
          "replacements": [\
            {\
              "value": "Stamp"\
            },\
            {\
              "value": "Tramp"\
            },\
            {\
              "value": "Tamp"\
            }\
          ],\
          "offset": 309,\
          "length": 6,\
          "context": {\
            "text": "...ited the train station, like many other AT&T users who experienced a sudden networ...",\
            "offset": 43,\
            "length": 6\
          },\
          "sentence": "But shortly after I exited the train station, like many other AT&T users who experienced a sudden network outage, I had no service or access to 5G internet data.",\
          "type": {\
            "typeName": "UnknownWord"\
          },\
          "rule": {\
            "id": "MORFOLOGIK_RULE_EN_US",\
            "description": "Possible spelling mistake",\
            "issueType": "misspelling",\
            "category": {\
              "id": "TYPOS",\
              "name": "Possible Typo"\
            }\
          },\
          "ignoreForIncompleteSentence": false,\
          "contextForSureMatch": 0\
        }\
      ],
      "warnings": {
        "incompleteResults": false
      },
      "score": 0.714,
      "grade": "A+"
    },
    "contentOptimizer": {
      "keyword_seeds": [\
        {\
          "keyword": "hotspot",\
          "min": 24,\
          "max": 42,\
          "current": 1\
        },\
        {\
          "keyword": "mobile",\
          "min": 15,\
          "max": 26,\
          "current": 1\
        },\
        {\
          "keyword": "data",\
          "min": 14,\
          "max": 25,\
          "current": 1\
        },\
        {\
          "keyword": "mobile hotspot",\
          "min": 9,\
          "max": 16,\
          "current": 1\
        },\
        {\
          "keyword": "devices",\
          "min": 9,\
          "max": 15,\
          "current": 0\
        },\
        {\
          "keyword": "hotspots",\
          "min": 7,\
          "max": 12,\
          "current": 0\
        },\
        {\
          "keyword": "device",\
          "min": 10,\
          "max": 17,\
          "current": 0\
        },\
        {\
          "keyword": "network",\
          "min": 5,\
          "max": 8,\
          "current": 1\
        },\
        {\
          "keyword": "internet",\
          "min": 7,\
          "max": 12,\
          "current": 1\
        },\
        {\
          "keyword": "plans",\
          "min": 7,\
          "max": 13,\
          "current": 0\
        },\
        {\
          "keyword": "plan",\
          "min": 7,\
          "max": 12,\
          "current": 0\
        },\
        {\
          "keyword": "wireless",\
          "min": 4,\
          "max": 8,\
          "current": 0\
        },\
        {\
          "keyword": "phone",\
          "min": 3,\
          "max": 5,\
          "current": 1\
        },\
        {\
          "keyword": "home",\
          "min": 4,\
          "max": 7,\
          "current": 0\
        },\
        {\
          "keyword": "hotspot data",\
          "min": 5,\
          "max": 9,\
          "current": 0\
        },\
        {\
          "keyword": "hotspot device",\
          "min": 3,\
          "max": 6,\
          "current": 0\
        },\
        {\
          "keyword": "mobile hotspots",\
          "min": 2,\
          "max": 3,\
          "current": 0\
        },\
        {\
          "keyword": "portable",\
          "min": 3,\
          "max": 5,\
          "current": 0\
        },\
        {\
          "keyword": "hotspot devices",\
          "min": 2,\
          "max": 4,\
          "current": 0\
        },\
        {\
          "keyword": "price",\
          "min": 3,\
          "max": 6,\
          "current": 0\
        },\
        {\
          "keyword": "learn",\
          "min": 2,\
          "max": 4,\
          "current": 0\
        },\
        {\
          "keyword": "signal",\
          "min": 1,\
          "max": 2,\
          "current": 0\
        },\
        {\
          "keyword": "monthly",\
          "min": 3,\
          "max": 5,\
          "current": 0\
        },\
        {\
          "keyword": "shop",\
          "min": 2,\
          "max": 4,\
          "current": 0\
        },\
        {\
          "keyword": "work",\
          "min": 2,\
          "max": 3,\
          "current": 1\
        },\
        {\
          "keyword": "security",\
          "min": 1,\
          "max": 2,\
          "current": 0\
        },\
        {\
          "keyword": "data plan",\
          "min": 3,\
          "max": 4,\
          "current": 0\
        },\
        {\
          "keyword": "mobile hotspot data",\
          "min": 2,\
          "max": 3,\
          "current": 0\
        },\
        {\
          "keyword": "data plans",\
          "min": 2,\
          "max": 3,\
          "current": 0\
        },\
        {\
          "keyword": "home internet",\
          "min": 1,\
          "max": 2,\
          "current": 0\
        },\
        {\
          "keyword": "mobile hotspot device",\
          "min": 2,\
          "max": 3,\
          "current": 0\
        },\
        {\
          "keyword": "personal",\
          "min": 1,\
          "max": 2,\
          "current": 0\
        },\
        {\
          "keyword": "battery life",\
          "min": 1,\
          "max": 2,\
          "current": 0\
        },\
        {\
          "keyword": "phones",\
          "min": 1,\
          "max": 2,\
          "current": 0\
        },\
        {\
          "keyword": "byon",\
          "min": 1,\
          "max": 2,\
          "current": 0\
        },\
        {\
          "keyword": "line",\
          "min": 2,\
          "max": 3,\
          "current": 0\
        },\
        {\
          "keyword": "customer",\
          "min": 1,\
          "max": 2,\
          "current": 0\
        },\
        {\
          "keyword": "items",\
          "min": 1,\
          "max": 2,\
          "current": 0\
        },\
        {\
          "keyword": "portable hotspot",\
          "min": 1,\
          "max": 2,\
          "current": 0\
        },\
        {\
          "keyword": "code",\
          "min": 1,\
          "max": 2,\
          "current": 0\
        },\
        {\
          "keyword": "best mobile",\
          "min": 1,\
          "max": 2,\
          "current": 0\
        },\
        {\
          "keyword": "deals",\
          "min": 1,\
          "max": 2,\
          "current": 0\
        },\
        {\
          "keyword": "networks",\
          "min": 1,\
          "max": 2,\
          "current": 0\
        },\
        {\
          "keyword": "public",\
          "min": 1,\
          "max": 2,\
          "current": 1\
        },\
        {\
          "keyword": "internet connection",\
          "min": 1,\
          "max": 2,\
          "current": 0\
        },\
        {\
          "keyword": "sarah lord",\
          "min": 1,\
          "max": 2,\
          "current": 0\
        },\
        {\
          "keyword": "pay",\
          "min": 1,\
          "max": 2,\
          "current": 0\
        },\
        {\
          "keyword": "hotspot data plan",\
          "min": 1,\
          "max": 2,\
          "current": 0\
        },\
        {\
          "keyword": "corporate network",\
          "min": 1,\
          "max": 2,\
          "current": 0\
        },\
        {\
          "keyword": "orbic speed",\
          "min": 1,\
          "max": 2,\
          "current": 0\
        },\
        {\
          "keyword": "credit",\
          "min": 1,\
          "max": 2,\
          "current": 0\
        },\
        {\
          "keyword": "best mobile hotspots",\
          "min": 1,\
          "max": 2,\
          "current": 0\
        },\
        {\
          "keyword": "cellular network",\
          "min": 1,\
          "max": 2,\
          "current": 0\
        },\
        {\
          "keyword": "service provider",\
          "min": 1,\
          "max": 2,\
          "current": 0\
        },\
        {\
          "keyword": "internet service",\
          "min": 1,\
          "max": 2,\
          "current": 0\
        },\
        {\
          "keyword": "antenna ports",\
          "min": 1,\
          "max": 2,\
          "current": 0\
        },\
        {\
          "keyword": "franklin wireless",\
          "min": 1,\
          "max": 2,\
          "current": 0\
        },\
        {\
          "keyword": "ultra wideband",\
          "min": 1,\
          "max": 2,\
          "current": 0\
        },\
        {\
          "keyword": "internet plans",\
          "min": 1,\
          "max": 2,\
          "current": 0\
        },\
        {\
          "keyword": "monthly plans",\
          "min": 1,\
          "max": 2,\
          "current": 0\
        },\
        {\
          "keyword": "internet access",\
          "min": 1,\
          "max": 2,\
          "current": 0\
        },\
        {\
          "keyword": "wireless internet",\
          "min": 1,\
          "max": 2,\
          "current": 0\
        },\
        {\
          "keyword": "cellular signal",\
          "min": 1,\
          "max": 2,\
          "current": 0\
        },\
        {\
          "keyword": "wireless data",\
          "min": 1,\
          "max": 2,\
          "current": 0\
        },\
        {\
          "keyword": "wireless network",\
          "min": 1,\
          "max": 2,\
          "current": 0\
        },\
        {\
          "keyword": "clear button",\
          "min": 1,\
          "max": 2,\
          "current": 0\
        },\
        {\
          "keyword": "access point",\
          "min": 1,\
          "max": 2,\
          "current": 0\
        },\
        {\
          "keyword": "phone plans",\
          "min": 1,\
          "max": 2,\
          "current": 0\
        },\
        {\
          "keyword": "multiple devices",\
          "min": 1,\
          "max": 2,\
          "current": 0\
        },\
        {\
          "keyword": "phone plan",\
          "min": 1,\
          "max": 2,\
          "current": 0\
        },\
        {\
          "keyword": "wireless access",\
          "min": 1,\
          "max": 2,\
          "current": 0\
        },\
        {\
          "keyword": "customer service",\
          "min": 1,\
          "max": 2,\
          "current": 0\
        },\
        {\
          "keyword": "unlimited starter",\
          "min": 1,\
          "max": 2,\
          "current": 0\
        },\
        {\
          "keyword": "unlimited premium",\
          "min": 1,\
          "max": 2,\
          "current": 0\
        },\
        {\
          "keyword": "external antenna",\
          "min": 1,\
          "max": 2,\
          "current": 0\
        },\
        {\
          "keyword": "devices connect",\
          "min": 1,\
          "max": 2,\
          "current": 0\
        },\
        {\
          "keyword": "connection charge",\
          "min": 1,\
          "max": 2,\
          "current": 0\
        },\
        {\
          "keyword": "cellular service",\
          "min": 1,\
          "max": 2,\
          "current": 0\
        },\
        {\
          "keyword": "hotspot data plans",\
          "min": 1,\
          "max": 2,\
          "current": 0\
        },\
        {\
          "keyword": "download speeds",\
          "min": 1,\
          "max": 2,\
          "current": 0\
        },\
        {\
          "keyword": "configurations service provider",\
          "min": 1,\
          "max": 2,\
          "current": 0\
        },\
        {\
          "keyword": "network connection",\
          "min": 1,\
          "max": 2,\
          "current": 0\
        },\
        {\
          "keyword": "full terms",\
          "min": 1,\
          "max": 2,\
          "current": 0\
        },\
        {\
          "keyword": "cell phone",\
          "min": 1,\
          "max": 2,\
          "current": 0\
        },\
        {\
          "keyword": "best phones",\
          "min": 1,\
          "max": 2,\
          "current": 0\
        },\
        {\
          "keyword": "wireless hotspot",\
          "min": 1,\
          "max": 2,\
          "current": 0\
        },\
        {\
          "keyword": "device connection",\
          "min": 1,\
          "max": 2,\
          "current": 0\
        },\
        {\
          "keyword": "hotspot feature",\
          "min": 1,\
          "max": 2,\
          "current": 0\
        },\
        {\
          "keyword": "tablet data",\
          "min": 1,\
          "max": 2,\
          "current": 0\
        },\
        {\
          "keyword": "select hotspot",\
          "min": 1,\
          "max": 2,\
          "current": 0\
        },\
        {\
          "keyword": "hotspot settings",\
          "min": 1,\
          "max": 2,\
          "current": 0\
        },\
        {\
          "keyword": "home security",\
          "min": 1,\
          "max": 2,\
          "current": 0\
        },\
        {\
          "keyword": "wireless home internet",\
          "min": 1,\
          "max": 2,\
          "current": 0\
        },\
        {\
          "keyword": "internet hotspot",\
          "min": 1,\
          "max": 2,\
          "current": 0\
        },\
        {\
          "keyword": "monthly payments",\
          "min": 1,\
          "max": 2,\
          "current": 0\
        },\
        {\
          "keyword": "power bank",\
          "min": 1,\
          "max": 2,\
          "current": 0\
        },\
        {\
          "keyword": "best cell phone",\
          "min": 1,\
          "max": 2,\
          "current": 0\
        },\
        {\
          "keyword": "device hotspot",\
          "min": 1,\
          "max": 2,\
          "current": 0\
        },\
        {\
          "keyword": "hotspots support",\
          "min": 1,\
          "max": 2,\
          "current": 0\
        },\
        {\
          "keyword": "add hotspot",\
          "min": 1,\
          "max": 2,\
          "current": 0\
        },\
        {\
          "keyword": "best hotspot",\
          "min": 1,\
          "max": 2,\
          "current": 0\
        },\
        {\
          "keyword": "service provider wireless",\
          "min": 1,\
          "max": 2,\
          "current": 0\
        },\
        {\
          "keyword": "home internet connection",\
          "min": 1,\
          "max": 2,\
          "current": 0\
        }\
      ],
      "heading_count_range": {
        "min": 22,
        "max": 39,
        "current": 0
      },
      "paragraph_count_range": {
        "min": 30,
        "max": 45,
        "current": 0
      },
      "word_count_range": {
        "min": 948,
        "max": 1644,
        "current": 140
      },
      "suggestions": [\
        "Introduce a clear definition of what a mobile hotspot is at the beginning of the content.",\
        "Add a section discussing the benefits of using a mobile hotspot, such as convenience, flexibility, and cost-effectiveness.",\
        "Include practical tips on how to set up a mobile hotspot on various devices (e.g., iPhone, Android).",\
        "Mention potential limitations or considerations when using a mobile hotspot, such as data caps or battery life.",\
        "Incorporate relevant keywords naturally throughout the text, such as 'mobile hotspot setup', 'using mobile hotspot for work', and 'mobile hotspot vs. public Wi-Fi'."\
      ],
      "competitors": [\
        {\
          "url": "https://www.pcmag.com/picks/the-best-mobile-hotspots",\
          "title": "The Best Mobile Hotspots for 2025 - PCMag",\
          "snippet": "Bring a personal Wi-Fi network with you wherever you go. These are the best mobile hotspots we've reviewed for each major US carrier.",\
          "search_engine_rank": 1,\
          "content_score": 45.4158\
        },\
        {\
          "url": "https://www.t-mobile.com/hotspots-iot-connected-devices",\
          "title": "Buy Portable WiFi Hotspots, IoT & Connected Devices | T-Mobile",\
          "snippet": "Access the internet on-demand as you travel on-the-go with T-Mobile's great range of portable wifi hotspot and mobile connected devices for sale.",\
          "search_engine_rank": 2,\
          "content_score": 46.5468\
        },\
        {\
          "url": "https://www.metrobyt-mobile.com/hotspots-iot-connected-devices",\
          "title": "Hotspot Devices for Wi-Fi on the Go - Metro by T-Mobile",\
          "snippet": "Shop our selection of portable hotspot devices for internet on-the-go on America's largest and now most awarded 5G network.",\
          "search_engine_rank": 3,\
          "content_score": 4.36897\
        },\
        {\
          "url": "https://www.verizon.com/internet-devices/",\
          "title": "Shop Hotspots and Internet Devices - Verizon",\
          "snippet": "A hotspot is a wireless access point that helps connect your smartphone, laptop, tablet, and other devices to the internet when WiFi isn't available.",\
          "search_engine_rank": 4,\
          "content_score": 62.9453\
        },\
        {\
          "url": "https://www.t-mobile.com/devices/iot/hotspots",\
          "title": "What is a Hotspot? Mobile WiFi, Portable Devices & More",\
          "snippet": "A portable hotspot device or a mobile hotspot on your phone lets you share your high-speed data to connect more devices to the internet in more places—all ...",\
          "search_engine_rank": 5,\
          "content_score": 51.9928\
        },\
        {\
          "url": "https://www.straighttalk.com/devices/wifi-hotspots",\
          "title": "Mobile Wi-Fi Hotspots - Shop Prepaid Hotspot Devices - Straight Talk",\
          "snippet": "Devices you want, prices you'll love. Always stay connected with mobile hotspots from Franklin, Moxee and more.",\
          "search_engine_rank": 6,\
          "content_score": 0\
        },\
        {\
          "url": "https://www.att.com/buy/connected-devices-and-more/",\
          "title": "Buy Wireless & Mobile Hotspot Routers | AT&T Wireless",\
          "snippet": "A hotspot is a physical location or device that provides internet access to Wi-Fi enabled devices, such as smartphones, tablets, and laptops, through a wireless ...",\
          "search_engine_rank": 7,\
          "content_score": 9.44267\
        },\
        {\
          "url": "https://play.google.com/store/apps/details?id=com.ertunga.wifihotspot&hl=en_US",\
          "title": "Portable WiFi - Mobile Hotspot - Apps on Google Play",\
          "snippet": "It is a simple & free WiFi hotspot app for android that you can use to share the internet with other devices.",\
          "search_engine_rank": 8,\
          "content_score": 0\
        },\
        {\
          "url": "https://www.cricketwireless.com/support/mobile-wifi/mobile-hotspot",\
          "title": "Mobile Hotspot | Mobile WiFi - Cricket Wireless",\
          "snippet": "What is a Mobile Hotspot? Mobile Hotspot allows you to use the Cricket network on the go, wherever there is coverage in all 50 U.S. states.",\
          "search_engine_rank": 9,\
          "content_score": 44.2394\
        },\
        {\
          "url": "https://support.google.com/android/answer/9059108?hl=en",\
          "title": "Share a mobile connection by hotspot or tethering on Android",\
          "snippet": "Touch and hold Hotspot . Turn on Wi-Fi hotspot. Tip: To find or change your hotspot name or password, tap it. You may need to first tap Set up Wi-Fi hotspot.",\
          "search_engine_rank": 10,\
          "content_score": 0\
        },\
        {\
          "url": "https://support.apple.com/en-us/111785",\
          "title": "How to set up a Personal Hotspot on your iPhone or iPad",\
          "snippet": "A Personal Hotspot lets you share the cellular data connection of your iPhone or iPad (Wi-Fi + Cellular) when you don't have access to a Wi-Fi network.",\
          "search_engine_rank": 11,\
          "content_score": 0\
        },\
        {\
          "url": "https://www.bestbuy.com/site/mobile-phone-accessories/mobile-hotspots/pcmcat184700050008.c?id=pcmcat184700050008",\
          "title": "Mobile Hotspots - Best Buy",\
          "snippet": "Shop Best Buy for mobile hotspots. Access the Web from virtually anywhere with a portable Wi-Fi hotspot device. Get Mi-Fi with or without a ...",\
          "search_engine_rank": 12,\
          "content_score": 0\
        },\
        {\
          "url": "https://support.microsoft.com/en-us/windows/use-your-windows-device-as-a-mobile-hotspot-c89b0fad-72d5-41e8-f7ea-406ad9036b85",\
          "title": "Use your Windows device as a mobile hotspot - Microsoft Support",\
          "snippet": "Learn how to use your Windows device as a mobile hotspot.",\
          "search_engine_rank": 13,\
          "content_score": 0\
        },\
        {\
          "url": "https://www.nytimes.com/wirecutter/reviews/best-mobile-wi-fi-hotspot/",\
          "title": "The 2 Best Wi-Fi Hotspots of 2025 | Reviews by Wirecutter",\
          "snippet": "And Verizon's data-only hotspot plans beat the offerings of AT&T and especially T-Mobile by offering far more data than you'd get via a mobile ...",\
          "search_engine_rank": 14,\
          "content_score": 0\
        },\
        {\
          "url": "https://www.verizon.com/plans/devices/hotspots/",\
          "title": "Unlimited Plus 5G and Unlimited Plan for Hotspots Verizon",\
          "snippet": "Mobile hotspots · Connect on the go with our hotspot data plans. · Mobile Hotspot plans. · Check out other connected device plans. · Additional information about ...",\
          "search_engine_rank": 15,\
          "content_score": 5.27894\
        },\
        {\
          "url": "https://www.att.com/support/article/wireless/KM1009376/",\
          "title": "Use Your Device's Hotspot - AT&T Wireless Customer Support",\
          "snippet": "To add more mobile hotspot data: Go to your myAT&T account overview. Sign in, if asked. Scroll to My devices and select Manage add-ons for the ...",\
          "search_engine_rank": 16,\
          "content_score": 53.1948\
        },\
        {\
          "url": "https://play.google.com/store/apps/details?id=com.kirici.mobilehotspot&hl=en_US",\
          "title": "Mobile Hotspot - Apps on Google Play",\
          "snippet": "Share your internet connection simply with devices nearby with the Mobile Hotspot app. Turn your phone into a portable wifi router that tethers the internet ...",\
          "search_engine_rank": 17,\
          "content_score": 0\
        },\
        {\
          "url": "https://soliswifi.co/?srsltid=AfmBOorLgZkZjgFswlKly2tJjYMY5SymSwCeXusy6SFrG9zn-GxoxovT",\
          "title": "Solis: Portable WiFi Hotspot Devices | Fast Global Internet Anywhere",\
          "snippet": "Get fast, secure Internet worldwide with Solis portable WiFi hotspots, with mobile data in 140+ countries—perfect for travel without roaming fees. Try Now!",\
          "search_engine_rank": 18,\
          "content_score": 8.59881\
        },\
        {\
          "url": "https://www.techtarget.com/whatis/definition/mobile-hotspot",\
          "title": "What is mobile hotspot? | Definition from TechTarget",\
          "snippet": "A mobile hotspot works by converting a 3G, 4G or 5G signal to a Wi-Fi signal and vice versa. It creates a Wi-Fi network that can be shared by multiple devices ...",\
          "search_engine_rank": 19,\
          "content_score": 74.0513\
        },\
        {\
          "url": "https://www.cricketwireless.com/support/mobile-wifi/hotspot-eligible-phones.html",\
          "title": "Mobile Hotspot Eligible Phones | Cricket Wireless",\
          "snippet": "With Eligible Cricket Unlimited plans: · Alcatel · Apple · Cricket · Huawei · LG · Motorola · Nokia · Samsung. Samsung Galaxy A01; Samsung Galaxy A02s; Samsung ...",\
          "search_engine_rank": 20,\
          "content_score": 5.4123\
        }\
      ],
      "content_score": 30.031721510346355
    }
  }
}
```

Show more

Was this section helpful?Yes

No

### What made this section unhelpful for you?

Confusing or unclear information

Incorrect or outdated information

Incomplete information or samples

Other

CancelSubmit

# Batch Scan

Scan multiple pieces of content for AI Detection, Plagiarism, Factual Claims, Readability, Grammar/Spelling

#### Header Parameters

X-OAI-API-KEYstring

#### Body ParametersExpand all

batchesarray

Show child attributes

titlestring Required

check\_aiboolean Required

check\_plagiarismboolean Required

check\_factsboolean Required

check\_readabilityboolean Required

check\_grammarboolean Required

### ResponseExpand all

200

Object

#### Response Attributes

scanIDstring

contentstring

aiobject

Show child attributes

plagiarismobject

Show child attributes

factsobject

Show child attributes

readabilityobject

Show child attributes

grammarobject

Show child attributes

credits\_usednumber

Was this section helpful?Yes

No

### What made this section unhelpful for you?

Confusing or unclear information

Incorrect or outdated information

Incomplete information or samples

Other

CancelSubmit

POST

/scan/batch

cURL

`1curl --location 'http://example.io/scan/batch' \
2--header 'X-OAI-API-KEY: your-api-key' \
3--data '{
4  "batches": [\
5    "Ronald Reagan (1911–2004) was an American politician and actor who served as the 40th president of the United States from 1981 to 1989. Reagan graduated from Eureka College in 1932 and began to work as a sports broadcaster in Iowa. In 1937, he moved to California, and became a well-known film actor there. From 1947 to 1952, and from 1959 to 1960, Reagan served as the president of the Screen Actors Guild. From 1967 to 1975, Reagan served as the 33rd governor of California. He was defeated in his run for the Republican presidential nomination in the 1968 election as well as the 1976 election, but won both the nomination and election in the 1980 election, defeating President Jimmy Carter. As president, Reagan implemented new political initiatives as well as economic policies, advocating a laissez-faire philosophy, but the extent to which these ideas were implemented is debatable.",\
6    "Ronald Reagan (1911–2004) was an American politician and actor who served as the 40th president of the United States from 1981 to 1989. Reagan graduated from Eureka College in 1932 and began to work as a sports broadcaster in Iowa. In 1937, he moved to California, and became a well-known film actor there. From 1947 to 1952, and from 1959 to 1960, Reagan served as the president of the Screen Actors Guild. From 1967 to 1975, Reagan served as the 33rd governor of California. He was defeated in his run for the Republican presidential nomination in the 1968 election as well as the 1976 election, but won both the nomination and election in the 1980 election, defeating President Jimmy Carter. As president, Reagan implemented new political initiatives as well as economic policies, advocating a laissez-faire philosophy, but the extent to which these ideas were implemented is debatable.",\
7    "Ronald Reagan (1911–2004) was an American politician and actor who served as the 40th president of the United States from 1981 to 1989. Reagan graduated from Eureka College in 1932 and began to work as a sports broadcaster in Iowa. In 1937, he moved to California, and became a well-known film actor there. From 1947 to 1952, and from 1959 to 1960, Reagan served as the president of the Screen Actors Guild. From 1967 to 1975, Reagan served as the 33rd governor of California. He was defeated in his run for the Republican presidential nomination in the 1968 election as well as the 1976 election, but won both the nomination and election in the 1980 election, defeating President Jimmy Carter. As president, Reagan implemented new political initiatives as well as economic policies, advocating a laissez-faire philosophy, but the extent to which these ideas were implemented is debatable.",\
8    "Ronald Reagan (1911–2004) was an American politician and actor who served as the 40th president of the United States from 1981 to 1989. Reagan graduated from Eureka College in 1932 and began to work as a sports broadcaster in Iowa. In 1937, he moved to California, and became a well-known film actor there. From 1947 to 1952, and from 1959 to 1960, Reagan served as the president of the Screen Actors Guild. From 1967 to 1975, Reagan served as the 33rd governor of California. He was defeated in his run for the Republican presidential nomination in the 1968 election as well as the 1976 election, but won both the nomination and election in the 1980 election, defeating President Jimmy Carter. As president, Reagan implemented new political initiatives as well as economic policies, advocating a laissez-faire philosophy, but the extent to which these ideas were implemented is debatable.",\
9    "Ronald Reagan (1911–2004) was an American politician and actor who served as the 40th president of the United States from 1981 to 1989. Reagan graduated from Eureka College in 1932 and began to work as a sports broadcaster in Iowa. In 1937, he moved to California, and became a well-known film actor there. From 1947 to 1952, and from 1959 to 1960, Reagan served as the president of the Screen Actors Guild. From 1967 to 1975, Reagan served as the 33rd governor of California. He was defeated in his run for the Republican presidential nomination in the 1968 election as well as the 1976 election, but won both the nomination and election in the 1980 election, defeating President Jimmy Carter. As president, Reagan implemented new political initiatives as well as economic policies, advocating a laissez-faire philosophy, but the extent to which these ideas were implemented is debatable.",\
10    "Ronald Reagan (1911–2004) was an American politician and actor who served as the 40th president of the United States from 1981 to 1989. Reagan graduated from Eureka College in 1932 and began to work as a sports broadcaster in Iowa. In 1937, he moved to California, and became a well-known film actor there. From 1947 to 1952, and from 1959 to 1960, Reagan served as the president of the Screen Actors Guild. From 1967 to 1975, Reagan served as the 33rd governor of California. He was defeated in his run for the Republican presidential nomination in the 1968 election as well as the 1976 election, but won both the nomination and election in the 1980 election, defeating President Jimmy Carter. As president, Reagan implemented new political initiatives as well as economic policies, advocating a laissez-faire philosophy, but the extent to which these ideas were implemented is debatable.",\
11    "Ronald Reagan (1911–2004) was an American politician and actor who served as the 40th president of the United States from 1981 to 1989. Reagan graduated from Eureka College in 1932 and began to work as a sports broadcaster in Iowa. In 1937, he moved to California, and became a well-known film actor there. From 1947 to 1952, and from 1959 to 1960, Reagan served as the president of the Screen Actors Guild. From 1967 to 1975, Reagan served as the 33rd governor of California. He was defeated in his run for the Republican presidential nomination in the 1968 election as well as the 1976 election, but won both the nomination and election in the 1980 election, defeating President Jimmy Carter. As president, Reagan implemented new political initiatives as well as economic policies, advocating a laissez-faire philosophy, but the extent to which these ideas were implemented is debatable.",\
12    "Ronald Reagan (1911–2004) was an American politician and actor who served as the 40th president of the United States from 1981 to 1989. Reagan graduated from Eureka College in 1932 and began to work as a sports broadcaster in Iowa. In 1937, he moved to California, and became a well-known film actor there. From 1947 to 1952, and from 1959 to 1960, Reagan served as the president of the Screen Actors Guild. From 1967 to 1975, Reagan served as the 33rd governor of California. He was defeated in his run for the Republican presidential nomination in the 1968 election as well as the 1976 election, but won both the nomination and election in the 1980 election, defeating President Jimmy Carter. As president, Reagan implemented new political initiatives as well as economic policies, advocating a laissez-faire philosophy, but the extent to which these ideas were implemented is debatable.",\
13    "Ronald Reagan (1911–2004) was an American politician and actor who served as the 40th president of the United States from 1981 to 1989. Reagan graduated from Eureka College in 1932 and began to work as a sports broadcaster in Iowa. In 1937, he moved to California, and became a well-known film actor there. From 1947 to 1952, and from 1959 to 1960, Reagan served as the president of the Screen Actors Guild. From 1967 to 1975, Reagan served as the 33rd governor of California. He was defeated in his run for the Republican presidential nomination in the 1968 election as well as the 1976 election, but won both the nomination and election in the 1980 election, defeating President Jimmy Carter. As president, Reagan implemented new political initiatives as well as economic policies, advocating a laissez-faire philosophy, but the extent to which these ideas were implemented is debatable.",\
14    "Ronald Reagan (1911–2004) was an American politician and actor who served as the 40th president of the United States from 1981 to 1989. Reagan graduated from Eureka College in 1932 and began to work as a sports broadcaster in Iowa. In 1937, he moved to California, and became a well-known film actor there. From 1947 to 1952, and from 1959 to 1960, Reagan served as the president of the Screen Actors Guild. From 1967 to 1975, Reagan served as the 33rd governor of California. He was defeated in his run for the Republican presidential nomination in the 1968 election as well as the 1976 election, but won both the nomination and election in the 1980 election, defeating President Jimmy Carter. As president, Reagan implemented new political initiatives as well as economic policies, advocating a laissez-faire philosophy, but the extent to which these ideas were implemented is debatable."\
15  ],
16  "title": "test batch scan",
17  "check_ai": true,
18  "check_plagiarism": false,
19  "check_facts": false,
20  "check_readability": false,
21  "check_grammar": false
22}'`

#### Response

200

```
[\
  {\
    "scanID": "removed from result",\
    "content": "Ronald Reagan (1911–2004) was an American politician and actor who served as the 40th president of the United States from 1981 to 1989. Reagan graduated from Eureka College in 1932 and began to work as a sports broadcaster in Iowa. In 1937, he moved to California, and became a well-known film actor there. From 1947 to 1952, and from 1959 to 1960, Reagan served as the president of the Screen Actors Guild. From 1967 to 1975, Reagan served as the 33rd governor of California. He was defeated in his run for the Republican presidential nomination in the 1968 election as well as the 1976 election, but won both the nomination and election in the 1980 election, defeating President Jimmy Carter. As president, Reagan implemented new political initiatives as well as economic policies, advocating a laissez-faire philosophy, but the extent to which these ideas were implemented is debatable.",\
    "ai": {\
      "aiModel": "lite",\
      "classification": {\
        "AI": 0,\
        "Original": 1\
      },\
      "confidence": {\
        "AI": 0.0686,\
        "Original": 0.9316\
      },\
      "blocks": [\
        {\
          "text": "Ronald Reagan (1911–2004) was an American politician and actor who served as the 40th president of the United States from 1981 to 1989. ",\
          "result": {\
            "fake": 0.0694836876201842,\
            "real": 0.9305163123798158,\
            "status": "success"\
          }\
        },\
        {\
          "text": "Reagan graduated from Eureka College in 1932 and began to work as a sports broadcaster in Iowa. ",\
          "result": {\
            "fake": 0.04443765942337252,\
            "real": 0.9555623405766275,\
            "status": "success"\
          }\
        },\
        {\
          "text": "In 1937, he moved to California, and became a well-known film actor there. ",\
          "result": {\
            "fake": 0.04193667584739269,\
            "real": 0.9580633241526073,\
            "status": "success"\
          }\
        },\
        {\
          "text": "From 1947 to 1952, and from 1959 to 1960, Reagan served as the president of the Screen Actors Guild. ",\
          "result": {\
            "fake": 0.02370056027255596,\
            "real": 0.976299439727444,\
            "status": "success"\
          }\
        },\
        {\
          "text": "From 1967 to 1975, Reagan served as the 33rd governor of California. ",\
          "result": {\
            "fake": 0.06742160377733053,\
            "real": 0.9325783962226695,\
            "status": "success"\
          }\
        },\
        {\
          "text": "He was defeated in his run for the Republican presidential nomination in the 1968 election as well as the 1976 election, but won both the nomination and election in the 1980 election, defeating President Jimmy Carter. ",\
          "result": {\
            "fake": 0.08266505131827928,\
            "real": 0.9173349486817207,\
            "status": "success"\
          }\
        },\
        {\
          "text": "As president, Reagan implemented new political initiatives as well as economic policies, advocating a laissez-faire philosophy, but the extent to which these ideas were implemented is debatable.",\
          "result": {\
            "fake": 0.15055476174088456,\
            "real": 0.8494452382591154,\
            "status": "success"\
          }\
        }\
      ]\
    },\
    "plagiarism": {\
      "error": "not selected"\
    },\
    "facts": {\
      "error": "not selected"\
    },\
    "readability": {\
      "error": "not selected"\
    },\
    "grammar": {\
      "error": "not selected"\
    },\
    "credits_used": 2\
  },\
  {\
    "scanID": "removed from result",\
    "content": "Ronald Reagan (1911–2004) was an American politician and actor who served as the 40th president of the United States from 1981 to 1989. Reagan graduated from Eureka College in 1932 and began to work as a sports broadcaster in Iowa. In 1937, he moved to California, and became a well-known film actor there. From 1947 to 1952, and from 1959 to 1960, Reagan served as the president of the Screen Actors Guild. From 1967 to 1975, Reagan served as the 33rd governor of California. He was defeated in his run for the Republican presidential nomination in the 1968 election as well as the 1976 election, but won both the nomination and election in the 1980 election, defeating President Jimmy Carter. As president, Reagan implemented new political initiatives as well as economic policies, advocating a laissez-faire philosophy, but the extent to which these ideas were implemented is debatable.",\
    "ai": {\
      "aiModel": "lite",\
      "classification": {\
        "AI": 0,\
        "Original": 1\
      },\
      "confidence": {\
        "AI": 0.0686,\
        "Original": 0.9316\
      },\
      "blocks": [\
        {\
          "text": "Ronald Reagan (1911–2004) was an American politician and actor who served as the 40th president of the United States from 1981 to 1989. ",\
          "result": {\
            "fake": 0.0694836876201842,\
            "real": 0.9305163123798158,\
            "status": "success"\
          }\
        },\
        {\
          "text": "Reagan graduated from Eureka College in 1932 and began to work as a sports broadcaster in Iowa. ",\
          "result": {\
            "fake": 0.04443765942337252,\
            "real": 0.9555623405766275,\
            "status": "success"\
          }\
        },\
        {\
          "text": "In 1937, he moved to California, and became a well-known film actor there. ",\
          "result": {\
            "fake": 0.04193667584739269,\
            "real": 0.9580633241526073,\
            "status": "success"\
          }\
        },\
        {\
          "text": "From 1947 to 1952, and from 1959 to 1960, Reagan served as the president of the Screen Actors Guild. ",\
          "result": {\
            "fake": 0.02370056027255596,\
            "real": 0.976299439727444,\
            "status": "success"\
          }\
        },\
        {\
          "text": "From 1967 to 1975, Reagan served as the 33rd governor of California. ",\
          "result": {\
            "fake": 0.06742160377733053,\
            "real": 0.9325783962226695,\
            "status": "success"\
          }\
        },\
        {\
          "text": "He was defeated in his run for the Republican presidential nomination in the 1968 election as well as the 1976 election, but won both the nomination and election in the 1980 election, defeating President Jimmy Carter. ",\
          "result": {\
            "fake": 0.08266505131827928,\
            "real": 0.9173349486817207,\
            "status": "success"\
          }\
        },\
        {\
          "text": "As president, Reagan implemented new political initiatives as well as economic policies, advocating a laissez-faire philosophy, but the extent to which these ideas were implemented is debatable.",\
          "result": {\
            "fake": 0.15055476174088456,\
            "real": 0.8494452382591154,\
            "status": "success"\
          }\
        }\
      ]\
    },\
    "plagiarism": {\
      "error": "not selected"\
    },\
    "facts": {\
      "error": "not selected"\
    },\
    "readability": {\
      "error": "not selected"\
    },\
    "grammar": {\
      "error": "not selected"\
    },\
    "credits_used": 2\
  },\
  {\
    "scanID": "removed from result",\
    "content": "Ronald Reagan (1911–2004) was an American politician and actor who served as the 40th president of the United States from 1981 to 1989. Reagan graduated from Eureka College in 1932 and began to work as a sports broadcaster in Iowa. In 1937, he moved to California, and became a well-known film actor there. From 1947 to 1952, and from 1959 to 1960, Reagan served as the president of the Screen Actors Guild. From 1967 to 1975, Reagan served as the 33rd governor of California. He was defeated in his run for the Republican presidential nomination in the 1968 election as well as the 1976 election, but won both the nomination and election in the 1980 election, defeating President Jimmy Carter. As president, Reagan implemented new political initiatives as well as economic policies, advocating a laissez-faire philosophy, but the extent to which these ideas were implemented is debatable.",\
    "ai": {\
      "aiModel": "lite",\
      "classification": {\
        "AI": 0,\
        "Original": 1\
      },\
      "confidence": {\
        "AI": 0.0686,\
        "Original": 0.9316\
      },\
      "blocks": [\
        {\
          "text": "Ronald Reagan (1911–2004) was an American politician and actor who served as the 40th president of the United States from 1981 to 1989. ",\
          "result": {\
            "fake": 0.0694836876201842,\
            "real": 0.9305163123798158,\
            "status": "success"\
          }\
        },\
        {\
          "text": "Reagan graduated from Eureka College in 1932 and began to work as a sports broadcaster in Iowa. ",\
          "result": {\
            "fake": 0.04443765942337252,\
            "real": 0.9555623405766275,\
            "status": "success"\
          }\
        },\
        {\
          "text": "In 1937, he moved to California, and became a well-known film actor there. ",\
          "result": {\
            "fake": 0.04193667584739269,\
            "real": 0.9580633241526073,\
            "status": "success"\
          }\
        },\
        {\
          "text": "From 1947 to 1952, and from 1959 to 1960, Reagan served as the president of the Screen Actors Guild. ",\
          "result": {\
            "fake": 0.02370056027255596,\
            "real": 0.976299439727444,\
            "status": "success"\
          }\
        },\
        {\
          "text": "From 1967 to 1975, Reagan served as the 33rd governor of California. ",\
          "result": {\
            "fake": 0.06742160377733053,\
            "real": 0.9325783962226695,\
            "status": "success"\
          }\
        },\
        {\
          "text": "He was defeated in his run for the Republican presidential nomination in the 1968 election as well as the 1976 election, but won both the nomination and election in the 1980 election, defeating President Jimmy Carter. ",\
          "result": {\
            "fake": 0.08266505131827928,\
            "real": 0.9173349486817207,\
            "status": "success"\
          }\
        },\
        {\
          "text": "As president, Reagan implemented new political initiatives as well as economic policies, advocating a laissez-faire philosophy, but the extent to which these ideas were implemented is debatable.",\
          "result": {\
            "fake": 0.15055476174088456,\
            "real": 0.8494452382591154,\
            "status": "success"\
          }\
        }\
      ]\
    },\
    "plagiarism": {\
      "error": "not selected"\
    },\
    "facts": {\
      "error": "not selected"\
    },\
    "readability": {\
      "error": "not selected"\
    },\
    "grammar": {\
      "error": "not selected"\
    },\
    "credits_used": 2\
  },\
  {\
    "scanID": "removed from result",\
    "content": "Ronald Reagan (1911–2004) was an American politician and actor who served as the 40th president of the United States from 1981 to 1989. Reagan graduated from Eureka College in 1932 and began to work as a sports broadcaster in Iowa. In 1937, he moved to California, and became a well-known film actor there. From 1947 to 1952, and from 1959 to 1960, Reagan served as the president of the Screen Actors Guild. From 1967 to 1975, Reagan served as the 33rd governor of California. He was defeated in his run for the Republican presidential nomination in the 1968 election as well as the 1976 election, but won both the nomination and election in the 1980 election, defeating President Jimmy Carter. As president, Reagan implemented new political initiatives as well as economic policies, advocating a laissez-faire philosophy, but the extent to which these ideas were implemented is debatable.",\
    "ai": {\
      "aiModel": "lite",\
      "classification": {\
        "AI": 0,\
        "Original": 1\
      },\
      "confidence": {\
        "AI": 0.0686,\
        "Original": 0.9316\
      },\
      "blocks": [\
        {\
          "text": "Ronald Reagan (1911–2004) was an American politician and actor who served as the 40th president of the United States from 1981 to 1989. ",\
          "result": {\
            "fake": 0.0694836876201842,\
            "real": 0.9305163123798158,\
            "status": "success"\
          }\
        },\
        {\
          "text": "Reagan graduated from Eureka College in 1932 and began to work as a sports broadcaster in Iowa. ",\
          "result": {\
            "fake": 0.04443765942337252,\
            "real": 0.9555623405766275,\
            "status": "success"\
          }\
        },\
        {\
          "text": "In 1937, he moved to California, and became a well-known film actor there. ",\
          "result": {\
            "fake": 0.04193667584739269,\
            "real": 0.9580633241526073,\
            "status": "success"\
          }\
        },\
        {\
          "text": "From 1947 to 1952, and from 1959 to 1960, Reagan served as the president of the Screen Actors Guild. ",\
          "result": {\
            "fake": 0.02370056027255596,\
            "real": 0.976299439727444,\
            "status": "success"\
          }\
        },\
        {\
          "text": "From 1967 to 1975, Reagan served as the 33rd governor of California. ",\
          "result": {\
            "fake": 0.06742160377733053,\
            "real": 0.9325783962226695,\
            "status": "success"\
          }\
        },\
        {\
          "text": "He was defeated in his run for the Republican presidential nomination in the 1968 election as well as the 1976 election, but won both the nomination and election in the 1980 election, defeating President Jimmy Carter. ",\
          "result": {\
            "fake": 0.08266505131827928,\
            "real": 0.9173349486817207,\
            "status": "success"\
          }\
        },\
        {\
          "text": "As president, Reagan implemented new political initiatives as well as economic policies, advocating a laissez-faire philosophy, but the extent to which these ideas were implemented is debatable.",\
          "result": {\
            "fake": 0.15055476174088456,\
            "real": 0.8494452382591154,\
            "status": "success"\
          }\
        }\
      ]\
    },\
    "plagiarism": {\
      "error": "not selected"\
    },\
    "facts": {\
      "error": "not selected"\
    },\
    "readability": {\
      "error": "not selected"\
    },\
    "grammar": {\
      "error": "not selected"\
    },\
    "credits_used": 2\
  },\
  {\
    "scanID": "removed from result",\
    "content": "Ronald Reagan (1911–2004) was an American politician and actor who served as the 40th president of the United States from 1981 to 1989. Reagan graduated from Eureka College in 1932 and began to work as a sports broadcaster in Iowa. In 1937, he moved to California, and became a well-known film actor there. From 1947 to 1952, and from 1959 to 1960, Reagan served as the president of the Screen Actors Guild. From 1967 to 1975, Reagan served as the 33rd governor of California. He was defeated in his run for the Republican presidential nomination in the 1968 election as well as the 1976 election, but won both the nomination and election in the 1980 election, defeating President Jimmy Carter. As president, Reagan implemented new political initiatives as well as economic policies, advocating a laissez-faire philosophy, but the extent to which these ideas were implemented is debatable.",\
    "ai": {\
      "aiModel": "lite",\
      "classification": {\
        "AI": 0,\
        "Original": 1\
      },\
      "confidence": {\
        "AI": 0.0686,\
        "Original": 0.9316\
      },\
      "blocks": [\
        {\
          "text": "Ronald Reagan (1911–2004) was an American politician and actor who served as the 40th president of the United States from 1981 to 1989. ",\
          "result": {\
            "fake": 0.0694836876201842,\
            "real": 0.9305163123798158,\
            "status": "success"\
          }\
        },\
        {\
          "text": "Reagan graduated from Eureka College in 1932 and began to work as a sports broadcaster in Iowa. ",\
          "result": {\
            "fake": 0.04443765942337252,\
            "real": 0.9555623405766275,\
            "status": "success"\
          }\
        },\
        {\
          "text": "In 1937, he moved to California, and became a well-known film actor there. ",\
          "result": {\
            "fake": 0.04193667584739269,\
            "real": 0.9580633241526073,\
            "status": "success"\
          }\
        },\
        {\
          "text": "From 1947 to 1952, and from 1959 to 1960, Reagan served as the president of the Screen Actors Guild. ",\
          "result": {\
            "fake": 0.02370056027255596,\
            "real": 0.976299439727444,\
            "status": "success"\
          }\
        },\
        {\
          "text": "From 1967 to 1975, Reagan served as the 33rd governor of California. ",\
          "result": {\
            "fake": 0.06742160377733053,\
            "real": 0.9325783962226695,\
            "status": "success"\
          }\
        },\
        {\
          "text": "He was defeated in his run for the Republican presidential nomination in the 1968 election as well as the 1976 election, but won both the nomination and election in the 1980 election, defeating President Jimmy Carter. ",\
          "result": {\
            "fake": 0.08266505131827928,\
            "real": 0.9173349486817207,\
            "status": "success"\
          }\
        },\
        {\
          "text": "As president, Reagan implemented new political initiatives as well as economic policies, advocating a laissez-faire philosophy, but the extent to which these ideas were implemented is debatable.",\
          "result": {\
            "fake": 0.15055476174088456,\
            "real": 0.8494452382591154,\
            "status": "success"\
          }\
        }\
      ]\
    },\
    "plagiarism": {\
      "error": "not selected"\
    },\
    "facts": {\
      "error": "not selected"\
    },\
    "readability": {\
      "error": "not selected"\
    },\
    "grammar": {\
      "error": "not selected"\
    },\
    "credits_used": 2\
  },\
  {\
    "scanID": "removed from result",\
    "content": "Ronald Reagan (1911–2004) was an American politician and actor who served as the 40th president of the United States from 1981 to 1989. Reagan graduated from Eureka College in 1932 and began to work as a sports broadcaster in Iowa. In 1937, he moved to California, and became a well-known film actor there. From 1947 to 1952, and from 1959 to 1960, Reagan served as the president of the Screen Actors Guild. From 1967 to 1975, Reagan served as the 33rd governor of California. He was defeated in his run for the Republican presidential nomination in the 1968 election as well as the 1976 election, but won both the nomination and election in the 1980 election, defeating President Jimmy Carter. As president, Reagan implemented new political initiatives as well as economic policies, advocating a laissez-faire philosophy, but the extent to which these ideas were implemented is debatable.",\
    "ai": {\
      "aiModel": "lite",\
      "classification": {\
        "AI": 0,\
        "Original": 1\
      },\
      "confidence": {\
        "AI": 0.0686,\
        "Original": 0.9316\
      },\
      "blocks": [\
        {\
          "text": "Ronald Reagan (1911–2004) was an American politician and actor who served as the 40th president of the United States from 1981 to 1989. ",\
          "result": {\
            "fake": 0.0694836876201842,\
            "real": 0.9305163123798158,\
            "status": "success"\
          }\
        },\
        {\
          "text": "Reagan graduated from Eureka College in 1932 and began to work as a sports broadcaster in Iowa. ",\
          "result": {\
            "fake": 0.04443765942337252,\
            "real": 0.9555623405766275,\
            "status": "success"\
          }\
        },\
        {\
          "text": "In 1937, he moved to California, and became a well-known film actor there. ",\
          "result": {\
            "fake": 0.04193667584739269,\
            "real": 0.9580633241526073,\
            "status": "success"\
          }\
        },\
        {\
          "text": "From 1947 to 1952, and from 1959 to 1960, Reagan served as the president of the Screen Actors Guild. ",\
          "result": {\
            "fake": 0.02370056027255596,\
            "real": 0.976299439727444,\
            "status": "success"\
          }\
        },\
        {\
          "text": "From 1967 to 1975, Reagan served as the 33rd governor of California. ",\
          "result": {\
            "fake": 0.06742160377733053,\
            "real": 0.9325783962226695,\
            "status": "success"\
          }\
        },\
        {\
          "text": "He was defeated in his run for the Republican presidential nomination in the 1968 election as well as the 1976 election, but won both the nomination and election in the 1980 election, defeating President Jimmy Carter. ",\
          "result": {\
            "fake": 0.08266505131827928,\
            "real": 0.9173349486817207,\
            "status": "success"\
          }\
        },\
        {\
          "text": "As president, Reagan implemented new political initiatives as well as economic policies, advocating a laissez-faire philosophy, but the extent to which these ideas were implemented is debatable.",\
          "result": {\
            "fake": 0.15055476174088456,\
            "real": 0.8494452382591154,\
            "status": "success"\
          }\
        }\
      ]\
    },\
    "plagiarism": {\
      "error": "not selected"\
    },\
    "facts": {\
      "error": "not selected"\
    },\
    "readability": {\
      "error": "not selected"\
    },\
    "grammar": {\
      "error": "not selected"\
    },\
    "credits_used": 2\
  },\
  {\
    "scanID": "removed from result",\
    "content": "Ronald Reagan (1911–2004) was an American politician and actor who served as the 40th president of the United States from 1981 to 1989. Reagan graduated from Eureka College in 1932 and began to work as a sports broadcaster in Iowa. In 1937, he moved to California, and became a well-known film actor there. From 1947 to 1952, and from 1959 to 1960, Reagan served as the president of the Screen Actors Guild. From 1967 to 1975, Reagan served as the 33rd governor of California. He was defeated in his run for the Republican presidential nomination in the 1968 election as well as the 1976 election, but won both the nomination and election in the 1980 election, defeating President Jimmy Carter. As president, Reagan implemented new political initiatives as well as economic policies, advocating a laissez-faire philosophy, but the extent to which these ideas were implemented is debatable.",\
    "ai": {\
      "aiModel": "lite",\
      "classification": {\
        "AI": 0,\
        "Original": 1\
      },\
      "confidence": {\
        "AI": 0.0686,\
        "Original": 0.9316\
      },\
      "blocks": [\
        {\
          "text": "Ronald Reagan (1911–2004) was an American politician and actor who served as the 40th president of the United States from 1981 to 1989. ",\
          "result": {\
            "fake": 0.0694836876201842,\
            "real": 0.9305163123798158,\
            "status": "success"\
          }\
        },\
        {\
          "text": "Reagan graduated from Eureka College in 1932 and began to work as a sports broadcaster in Iowa. ",\
          "result": {\
            "fake": 0.04443765942337252,\
            "real": 0.9555623405766275,\
            "status": "success"\
          }\
        },\
        {\
          "text": "In 1937, he moved to California, and became a well-known film actor there. ",\
          "result": {\
            "fake": 0.04193667584739269,\
            "real": 0.9580633241526073,\
            "status": "success"\
          }\
        },\
        {\
          "text": "From 1947 to 1952, and from 1959 to 1960, Reagan served as the president of the Screen Actors Guild. ",\
          "result": {\
            "fake": 0.02370056027255596,\
            "real": 0.976299439727444,\
            "status": "success"\
          }\
        },\
        {\
          "text": "From 1967 to 1975, Reagan served as the 33rd governor of California. ",\
          "result": {\
            "fake": 0.06742160377733053,\
            "real": 0.9325783962226695,\
            "status": "success"\
          }\
        },\
        {\
          "text": "He was defeated in his run for the Republican presidential nomination in the 1968 election as well as the 1976 election, but won both the nomination and election in the 1980 election, defeating President Jimmy Carter. ",\
          "result": {\
            "fake": 0.08266505131827928,\
            "real": 0.9173349486817207,\
            "status": "success"\
          }\
        },\
        {\
          "text": "As president, Reagan implemented new political initiatives as well as economic policies, advocating a laissez-faire philosophy, but the extent to which these ideas were implemented is debatable.",\
          "result": {\
            "fake": 0.15055476174088456,\
            "real": 0.8494452382591154,\
            "status": "success"\
          }\
        }\
      ]\
    },\
    "plagiarism": {\
      "error": "not selected"\
    },\
    "facts": {\
      "error": "not selected"\
    },\
    "readability": {\
      "error": "not selected"\
    },\
    "grammar": {\
      "error": "not selected"\
    },\
    "credits_used": 2\
  },\
  {\
    "scanID": "removed from result",\
    "content": "Ronald Reagan (1911–2004) was an American politician and actor who served as the 40th president of the United States from 1981 to 1989. Reagan graduated from Eureka College in 1932 and began to work as a sports broadcaster in Iowa. In 1937, he moved to California, and became a well-known film actor there. From 1947 to 1952, and from 1959 to 1960, Reagan served as the president of the Screen Actors Guild. From 1967 to 1975, Reagan served as the 33rd governor of California. He was defeated in his run for the Republican presidential nomination in the 1968 election as well as the 1976 election, but won both the nomination and election in the 1980 election, defeating President Jimmy Carter. As president, Reagan implemented new political initiatives as well as economic policies, advocating a laissez-faire philosophy, but the extent to which these ideas were implemented is debatable.",\
    "ai": {\
      "aiModel": "lite",\
      "classification": {\
        "AI": 0,\
        "Original": 1\
      },\
      "confidence": {\
        "AI": 0.0686,\
        "Original": 0.9316\
      },\
      "blocks": [\
        {\
          "text": "Ronald Reagan (1911–2004) was an American politician and actor who served as the 40th president of the United States from 1981 to 1989. ",\
          "result": {\
            "fake": 0.0694836876201842,\
            "real": 0.9305163123798158,\
            "status": "success"\
          }\
        },\
        {\
          "text": "Reagan graduated from Eureka College in 1932 and began to work as a sports broadcaster in Iowa. ",\
          "result": {\
            "fake": 0.04443765942337252,\
            "real": 0.9555623405766275,\
            "status": "success"\
          }\
        },\
        {\
          "text": "In 1937, he moved to California, and became a well-known film actor there. ",\
          "result": {\
            "fake": 0.04193667584739269,\
            "real": 0.9580633241526073,\
            "status": "success"\
          }\
        },\
        {\
          "text": "From 1947 to 1952, and from 1959 to 1960, Reagan served as the president of the Screen Actors Guild. ",\
          "result": {\
            "fake": 0.02370056027255596,\
            "real": 0.976299439727444,\
            "status": "success"\
          }\
        },\
        {\
          "text": "From 1967 to 1975, Reagan served as the 33rd governor of California. ",\
          "result": {\
            "fake": 0.06742160377733053,\
            "real": 0.9325783962226695,\
            "status": "success"\
          }\
        },\
        {\
          "text": "He was defeated in his run for the Republican presidential nomination in the 1968 election as well as the 1976 election, but won both the nomination and election in the 1980 election, defeating President Jimmy Carter. ",\
          "result": {\
            "fake": 0.08266505131827928,\
            "real": 0.9173349486817207,\
            "status": "success"\
          }\
        },\
        {\
          "text": "As president, Reagan implemented new political initiatives as well as economic policies, advocating a laissez-faire philosophy, but the extent to which these ideas were implemented is debatable.",\
          "result": {\
            "fake": 0.15055476174088456,\
            "real": 0.8494452382591154,\
            "status": "success"\
          }\
        }\
      ]\
    },\
    "plagiarism": {\
      "error": "not selected"\
    },\
    "facts": {\
      "error": "not selected"\
    },\
    "readability": {\
      "error": "not selected"\
    },\
    "grammar": {\
      "error": "not selected"\
    },\
    "credits_used": 2\
  },\
  {\
    "scanID": "removed from result",\
    "content": "Ronald Reagan (1911–2004) was an American politician and actor who served as the 40th president of the United States from 1981 to 1989. Reagan graduated from Eureka College in 1932 and began to work as a sports broadcaster in Iowa. In 1937, he moved to California, and became a well-known film actor there. From 1947 to 1952, and from 1959 to 1960, Reagan served as the president of the Screen Actors Guild. From 1967 to 1975, Reagan served as the 33rd governor of California. He was defeated in his run for the Republican presidential nomination in the 1968 election as well as the 1976 election, but won both the nomination and election in the 1980 election, defeating President Jimmy Carter. As president, Reagan implemented new political initiatives as well as economic policies, advocating a laissez-faire philosophy, but the extent to which these ideas were implemented is debatable.",\
    "ai": {\
      "aiModel": "lite",\
      "classification": {\
        "AI": 0,\
        "Original": 1\
      },\
      "confidence": {\
        "AI": 0.0686,\
        "Original": 0.9316\
      },\
      "blocks": [\
        {\
          "text": "Ronald Reagan (1911–2004) was an American politician and actor who served as the 40th president of the United States from 1981 to 1989. ",\
          "result": {\
            "fake": 0.0694836876201842,\
            "real": 0.9305163123798158,\
            "status": "success"\
          }\
        },\
        {\
          "text": "Reagan graduated from Eureka College in 1932 and began to work as a sports broadcaster in Iowa. ",\
          "result": {\
            "fake": 0.04443765942337252,\
            "real": 0.9555623405766275,\
            "status": "success"\
          }\
        },\
        {\
          "text": "In 1937, he moved to California, and became a well-known film actor there. ",\
          "result": {\
            "fake": 0.04193667584739269,\
            "real": 0.9580633241526073,\
            "status": "success"\
          }\
        },\
        {\
          "text": "From 1947 to 1952, and from 1959 to 1960, Reagan served as the president of the Screen Actors Guild. ",\
          "result": {\
            "fake": 0.02370056027255596,\
            "real": 0.976299439727444,\
            "status": "success"\
          }\
        },\
        {\
          "text": "From 1967 to 1975, Reagan served as the 33rd governor of California. ",\
          "result": {\
            "fake": 0.06742160377733053,\
            "real": 0.9325783962226695,\
            "status": "success"\
          }\
        },\
        {\
          "text": "He was defeated in his run for the Republican presidential nomination in the 1968 election as well as the 1976 election, but won both the nomination and election in the 1980 election, defeating President Jimmy Carter. ",\
          "result": {\
            "fake": 0.08266505131827928,\
            "real": 0.9173349486817207,\
            "status": "success"\
          }\
        },\
        {\
          "text": "As president, Reagan implemented new political initiatives as well as economic policies, advocating a laissez-faire philosophy, but the extent to which these ideas were implemented is debatable.",\
          "result": {\
            "fake": 0.15055476174088456,\
            "real": 0.8494452382591154,\
            "status": "success"\
          }\
        }\
      ]\
    },\
    "plagiarism": {\
      "error": "not selected"\
    },\
    "facts": {\
      "error": "not selected"\
    },\
    "readability": {\
      "error": "not selected"\
    },\
    "grammar": {\
      "error": "not selected"\
    },\
    "credits_used": 2\
  },\
  {\
    "scanID": "removed from result",\
    "content": "Ronald Reagan (1911–2004) was an American politician and actor who served as the 40th president of the United States from 1981 to 1989. Reagan graduated from Eureka College in 1932 and began to work as a sports broadcaster in Iowa. In 1937, he moved to California, and became a well-known film actor there. From 1947 to 1952, and from 1959 to 1960, Reagan served as the president of the Screen Actors Guild. From 1967 to 1975, Reagan served as the 33rd governor of California. He was defeated in his run for the Republican presidential nomination in the 1968 election as well as the 1976 election, but won both the nomination and election in the 1980 election, defeating President Jimmy Carter. As president, Reagan implemented new political initiatives as well as economic policies, advocating a laissez-faire philosophy, but the extent to which these ideas were implemented is debatable.",\
    "ai": {\
      "aiModel": "lite",\
      "classification": {\
        "AI": 0,\
        "Original": 1\
      },\
      "confidence": {\
        "AI": 0.0686,\
        "Original": 0.9316\
      },\
      "blocks": [\
        {\
          "text": "Ronald Reagan (1911–2004) was an American politician and actor who served as the 40th president of the United States from 1981 to 1989. ",\
          "result": {\
            "fake": 0.0694836876201842,\
            "real": 0.9305163123798158,\
            "status": "success"\
          }\
        },\
        {\
          "text": "Reagan graduated from Eureka College in 1932 and began to work as a sports broadcaster in Iowa. ",\
          "result": {\
            "fake": 0.04443765942337252,\
            "real": 0.9555623405766275,\
            "status": "success"\
          }\
        },\
        {\
          "text": "In 1937, he moved to California, and became a well-known film actor there. ",\
          "result": {\
            "fake": 0.04193667584739269,\
            "real": 0.9580633241526073,\
            "status": "success"\
          }\
        },\
        {\
          "text": "From 1947 to 1952, and from 1959 to 1960, Reagan served as the president of the Screen Actors Guild. ",\
          "result": {\
            "fake": 0.02370056027255596,\
            "real": 0.976299439727444,\
            "status": "success"\
          }\
        },\
        {\
          "text": "From 1967 to 1975, Reagan served as the 33rd governor of California. ",\
          "result": {\
            "fake": 0.06742160377733053,\
            "real": 0.9325783962226695,\
            "status": "success"\
          }\
        },\
        {\
          "text": "He was defeated in his run for the Republican presidential nomination in the 1968 election as well as the 1976 election, but won both the nomination and election in the 1980 election, defeating President Jimmy Carter. ",\
          "result": {\
            "fake": 0.08266505131827928,\
            "real": 0.9173349486817207,\
            "status": "success"\
          }\
        },\
        {\
          "text": "As president, Reagan implemented new political initiatives as well as economic policies, advocating a laissez-faire philosophy, but the extent to which these ideas were implemented is debatable.",\
          "result": {\
            "fake": 0.15055476174088456,\
            "real": 0.8494452382591154,\
            "status": "success"\
          }\
        }\
      ]\
    },\
    "plagiarism": {\
      "error": "not selected"\
    },\
    "facts": {\
      "error": "not selected"\
    },\
    "readability": {\
      "error": "not selected"\
    },\
    "grammar": {\
      "error": "not selected"\
    },\
    "credits_used": 2\
  }\
]
```

Show more

Was this section helpful?Yes

No

### What made this section unhelpful for you?

Confusing or unclear information

Incorrect or outdated information

Incomplete information or samples

Other

CancelSubmit

# Scan Url

Run a new scan on a url. Check for AI Detection, Plagiarism, Factual Claims, Readability, Grammar/Spelling and Content Optimization

#### Header Parameters

X-OAI-API-KEYstring

#### Body Parameters

urlstring

titlestring

excludedUrlstring

check\_aiboolean

check\_plagiarismboolean

check\_factsboolean

check\_readabilityboolean

check\_grammarboolean

check\_contentOptimizerboolean

optimizerQuerystring

optimizerCountrystring

optimizerDevicestring

optimizerPublishingDomainstring

storeScanboolean

aiModelstring

### ResponseExpand all

200

Object

#### Response Attributes

propertiesobject

Show child attributes

creditsobject

Show child attributes

aiobject

Show child attributes

plagiarismobject

Show child attributes

factsarray

Show child attributes

readabilityobject

Show child attributes

grammarSpellingobject

Show child attributes

contentOptimizerobject

Show child attributes

Was this section helpful?Yes

No

### What made this section unhelpful for you?

Confusing or unclear information

Incorrect or outdated information

Incomplete information or samples

Other

CancelSubmit

POST

/scan/url

cURL

`1curl --location 'http://example.io/scan/url' \
2--header 'X-OAI-API-KEY: your-api-key' \
3--data '{
4  "url": "https://www.cnet.com/home/internet/i-tried-using-my-mobile-hotspot-at-home-heres-everything-that-went-wrong/#google_vignette",
5  "title": "test api v3 url scan",
6  "excludedUrl": null,
7  "check_ai": true,
8  "check_plagiarism": true,
9  "check_facts": true,
10  "check_readability": true,
11  "check_grammar": true,
12  "check_contentOptimizer": true,
13  "optimizerQuery": "Mobile Hotspot",
14  "optimizerCountry": "United States",
15  "optimizerDevice": "Desktop",
16  "optimizerPublishingDomain": "https://www.cnet.com/home/internet/i-tried-using-my-mobile-hotspot-at-home-heres-everything-that-went-wrong/",
17  "storeScan": true,
18  "aiModel": "turbo"
19}'`

#### Response

200

```
[\
  {\
    "properties": {\
      "privateID": 123456789,\
      "id": "removed from response",\
      "title": "test api v3 url scan",\
      "excludedUrls": [\
        "https://example.com"\
      ],\
      "publicLink": "removed from response",\
      "content": "Our expert, award-winning staff selects the products we cover and rigorously researches and tests our top picks. If you buy through our links, we may get a commission. How we test ISPs A mobile hotspot can be a convenient way to stay connected on the go. But how valuable is it if you use it at home? I didn't realize how convenient it is to stay connected by using my phone as a mobile hotspot until I found myself without service in New York City on a random Thursday last year.  On my way to the office, I used my cellphone to work on the train. But shortly after I exited the train station, like many other AT&T users who experienced a sudden network outage, I had no service or access to 5G internet data.  It took me a few visits to different coffee shops in the area to finally find free Wi-Fi I could connect to. After finally finding a place that allowed me to use their public Wi-Fi, I texted my family and let them know that they wouldn't be able to contact me until I reached the office, which was still a ways away.  Locating local internet providers Looking back at this moment, I realized that this unplanned network outage could've been a lot worse had I not found a hotspot to connect to and get back online. But have you ever thought about using a mobile hotspot at home? I know what you might be thinking: Isn't that counterintuitive when you can just use your traditional home internet connection? Probably, but there are some unique benefits, as well as some suspected limitations. Here's what I discovered after using my mobile hotspot at home.   Locating local internet providers A hotspot is a physical location where people can connect wirelessly to the internet. There are three different types of hotspots: private, public and mobile. Each type of hotspot serves a different way for you to connect to the internet. Let's take a closer look at the types of hotspots available. Public hotspots are specific locations established by businesses or public spaces that provide free Wi-Fi. You can find these in libraries, cafes and even shopping malls. Public hotspots allow anyone within range to connect to the internet and usually lack the security you'd find with a private hotspot. Most public hotspots are not encrypted with passwords, which makes it easier for hackers or outside threats like malware and viruses to intercept connected devices. If you are handling sensitive information while connected to a public hotspot, you should take extra security measures, such as using a VPN. On the other hand, a private hotspot is not free, but it is more secure than a public hotspot. For example, your home network can be characterized as a private hotspot. A private hotspot can wirelessly connect devices to the internet using a router supported by your internet service provider. Your network will likely be encrypted with a strong Wi-Fi password and only certain people will be able to access it. The cellular network that your mobile phone is connected to can also be used as a hotspot. If your phone is nearby, you can connect devices such as your computer, tablet, smart gadgets and more to the internet. Many mobile providers such as AT&T, T-Mobile and Verizon offer users the built-in personal hotspot feature.  I tested my mobile hotspot for three days as my primary internet connection method. Before setting up my mobile hotspot, I ensured my phone was near my computer. First, I simply disconnected from my Wi-Fi on my phone, went into my IOS settings and turned on my personal hotspot. From here, I opened the Wi-Fi panel on my computer, waded through the different networks and connected to my phone's hotspot. My mobile provider is AT&T, and I was on the 60GB Unlimited data plan. Here's what I found.  The first thing that leaped out at me was the speed. On average, I was getting less than 10 megabits per second in download and about 10Mbps in upload. Yeah, that's a no from me. When using my mobile hotspot, I received an average download speed of less than 10Mbps and only 10Mbps in uploads. Speed is usually not a deal-breaker, since I don't game excessively or stream that frequently. But working from home means conducting video conferences, which require at least 10 to 20Mbps, as per CNET's speed guide. I used Ookla to perform an internet speed test over my mobile hotspot. (Disclosure: Ookla is owned by the same parent company as CNET, Ziff Davis.) I averaged less than 10Mbps in downloads and 10Mbps in uploads daily. Comparatively, I saw much faster speeds when I used my traditional Wi-Fi router, which was receiving an average of over 530Mbps in downloads and 240Mbps in uploads. Besides the intermittent lagging during video conferences, sending large files and emails also took a hit.  CNET's How-To expert Nelson Aguilar encourages users to avoid connecting their computers to a mobile hotspot.  \"The only time I ever use a mobile hotspot is when I'm sharing it with someone else's phone or tablet,\" says Aguilar. \"A mobile device typically uses less data than a computer, and so the performance is much higher than with a computer, which often runs several high-bandwidth tasks in the backg