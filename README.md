<div align="center">
    <img src="https://i.imgur.com/OE6dzTB.png">
</div>
<!-- <hr> -->
<div align=center>
  <h2 align=center>UOL Chat Room API - Talk with everyone!</h2>
  <h3 align=center>Back-End API Project</h3>
  <hr>
  <div align=center>
     <h4>This back-end api is based on a old famous chat used a lot here in Brazil (Bate papo UOL)</h4>
     <h4>The project is made only in back-end, Node.js and express and MongoDb. This was the firs time using a database, i used 
     MongoDB for data storaging. I made all the routes and the data requests.</h4>
     <h4>This was the twelfth project of the Driven full stack web development bootcamp.</h4>
</div>
<br>
    <img style="height:600px" src="https://i.imgur.com/QP0enz8.gif">
<br>
</div>

## Features

- Users and messages persisted on the database (MongoDB)
- Unique user validation
- You can send, delete messages
- Private messages filtered through info passed via headers
- Schema validation for users and messages
- "User still online" validation through checking every X seconds

 ### Built with

![Node](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Visual Studio Code](https://img.shields.io/badge/Visual%20Studio%20Code-0078d7.svg?style=for-the-badge&logo=visual-studio-code&logoColor=white)

## API Documentation

### Participants

* Register new online participant
  
  ```http
  POST /participants
  ```

  ##### Request:

  | Body   | Type     | Description                   |
  | :----- | :------- | :---------------------------- |
  | `name` | `string` | **Required** - Valid username |

* Get all online participants

  ```http
  GET /participants
  ```

  #### Response:

  ```json
  [
    {
      "_id": "string",
      "name": "string",
      "lastStatus": "number"
    },
    {
      "_id": "string",
      "name": "string",
      "lastStatus": "number"
    }
  ]

### Messages

* Get all messages

  ```http
  GET /messages
  ```

  #### Query strings:

  | Parameter | description                    |
  | :-------- | :----------------------------- |
  | `limit`   | Quantity of messages to return |

  #### Headers:

  | Name   | Description |
  | :----- | :---------- |
  | `user` | username    |

  #### Response:

  ```json
  [
    {
      "_id": "string",
      "from": "string",
      "to": "string",
      "text": "string",
      "type": "string",
      "time": "22:51:55"
      "_time": "number"
    },
    {
      "_id": "string",
      "from": "string",
      "to": "string",
      "text": "string",
      "type": "string",
      "time": "string",
      "_time": "number"
    }
  ]
  ```
  `to: "Todos" or any participant name`

  `type: "status" | "message" | "private_message"`

* Post a new message

  ```http
  POST /messages
  ```

  #### Request body:

  ```json
  {
    "to": "string",
    "text": "string",
    "type": "string"
  } 
  ```

  `type: "message" | "private_message"`

  #### Headers:

  | Name   | Description             |
  | :----- | :---------------------- |
  | `user` | **Required** - Username |

* Delete message

  ```http
  DELETE /messages/{messageId}
  ```

  #### Path parameters:

  | Parameter   | description                            |
  | :---------- | :------------------------------------- |
  | `messageId` | **Required** - ID of message to delete |

  #### Headers:

  | Name   | Description             |
  | :----- | :---------------------- |
  | `user` | **Required** - Username |

### Status

* Renew status "online" of participant

  ```http
  POST /status
  ```

  #### Headers:

  | Name   | Description             |
  | :----- | :---------------------- |
  | `user` | **Required** - username |


## Contact

Feel free to contact me in Linkedin!

[![LinkedIn][linkedin-shield]][linkedin-url]

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=blue
[linkedin-url]: https://www.linkedin.com/in/ovinibarros/
