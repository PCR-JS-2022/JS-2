## JS#2
Иннокентий очень рад тому, что теперь он может не запоминать все дни рождения своих друзей, за него это делает ваша программа. Теперь Кеша знает, какие дни у него свободны и просит вас помочь спланировать его расписание.

Время от времени Кеша хочет встречаться со своими друзьями и заниматься разными делами: с кем-то он хочет ходить в магазин, с кем-то в клуб, а с кем-то играть в настолки. Для того, чтобы организовать свой график, ему потребуется ежедневник, в который бы он руками записывал все мероприятия. Но мы сказали Кеше, что у вас много свободного времени и вы можете помочь ему с автоматизацией этого процесса.

Иннокентий научился работать с объектом ``Date`` в JavaScript и дополнил исходные данные, которые предоставил для вас в прошлый раз. Каждому человеку из телефонной книги он дописал список интересов и диапазон дат, когда друг свободен и мог бы прийти на встречу, а также почту, которую следует использовать как уникальный идентификатор.

### Пример входных данных
```js
const phoneList = [
  {
    name: 'Александра',
    interests: ['games', 'computers'],
    email: 'alexandra@rambler.ru',
    freeRange: {
      startDate: new Date('01.01.2020'),
      endDate: new Date('03.10.2020'),
    }
  },
  {
    name: 'Василий',
    interests: ['games'],
    email: 'vasiliy@mail.ru',
    freeRange: {
      startDate: new Date('02.05.2020'),
      endDate: new Date('02.25.2020'),
    }
  },
  {
    name: 'Роман',
    email: 'roman@yandex.ru',
    interests: ['javascript'],
    freeRange: {
      startDate: new Date('05.01.2020'),
      endDate: new Date('06.10.2020'),
    }
  },
  {
    name: 'Егор',
    email: 'egor@gmail.ru',
    interests: ['computers', 'javascript'],
    freeRange: {
      startDate: new Date('03.01.2020'),
      endDate: new Date('08.10.2020'),
    }
  },
];
```
Чтобы программой было удобно пользоваться, вам предстоит реализовать 3 функции:

1.  Функция ``createGroup`` должна принимать название интереса группы, а возвращать объект группы с 3 методами для удобной работы с ней:
  
	*  Метод ``getAll`` должен возвращать коллекцию друзей, которые находятся в этой группе;
    
	* Метод ``includePerson`` должен принимать человека, проверять, есть ли в его списке интересов тот, по которому создана эта группа и добавлять его.  
    Метод должен возвращать ``true``, если человек добавлен в группу и ``false`` в обратном случае;
    
	* Метод ``exludePerson`` должен принимать почту человека и удалять его из коллекции друзей этой группы, если он там был. 
    Метод должен возвращать ``true``, если операция удаления произведена успешно, и ``false`` в ином случае.
	 ### Пример создания группы и использования её методов
	```js
	const javaScriptGroup = createGroup('javascript');
	javaScriptGroup.includePerson(phoneList[2]); // true
	javaScriptGroup.includePerson(phoneList[0]); // false
	javaScriptGroup.includePerson(phoneList[3]); // true

	javaScriptGroup.exludePerson('vasiliy@mail.ru'); // false
	javaScriptGroup.exludePerson('roman@yandex.ru'); // true

	javaScriptGroup.getAll();
	/*
	  [
	    {
	      name: 'Егор',
	      interests: ['computers', 'javascript'],
	      email: 'egor@gmail.ru',
	      freeRange: {
	        startDate: new Date('03.01.2020'),
	        endDate: new Date('08.10.2020'),
	      }
	    },
	  ]
	*/
	```

2.  Функция ``findMeetingMembers`` должна принимать день проведения встречи группы и возвращать всех людей из группы, которые могут в этот день посетить встречу;
	### Пример использования функции ``findMeetingMembers``
	```js
	const javaScriptGroup = createGroup('javascript');
	javaScriptGroup.includePerson(phoneList[2]); // true
	javaScriptGroup.includePerson(phoneList[3]); // true

	findMeetingMembers(javaScriptGroup, new Date('10.10.2020')); // 0
	findMeetingMembers(javaScriptGroup, new Date('06.10.2020')); // 2
	```
    
3.  Функция ``findMeetingDateWithMaximumMembers`` должна найти первый день для встречи, в который смогут прийти максимальное количество людей из группы.
	### Пример использования функции ``findMeetingDateWithMaximumMembers``
	```js
	const gamesGroup = createGroup('games');
	javaScriptGroup.includePerson(phoneList[0]); // true
	javaScriptGroup.includePerson(phoneList[1]); // true

	findMeetingDateWithMaximumMembers(gamesGroup); // 02.05.2020
	```
### Полезные ссылки:
1. [Работа с объектом Date в JS](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Date)
