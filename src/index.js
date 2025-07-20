import 'dotenv/config';
import OpenAI from 'openai';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tarotDeck = [
	{
		id: 1,
		name: 'Шут',
		description: 'Невинность, спонтанность, новое начало, авантюра',
		img: '00',
	},
	{ id: 2, name: 'Маг', description: 'Сила воли, проявление, творческий потенциал', img: '01' },
	{ id: 3, name: 'Верховная Жрица', description: 'Интуиция, тайны, внутреннее знание', img: '02' },
	{
		id: 4,
		name: 'Императрица',
		description: 'Плодородие, изобилие, забота, женская энергия',
		img: '03',
	},
	{
		id: 5,
		name: 'Император',
		description: 'Структура, авторитет, стабильность, контроль',
		img: '04',
	},
	{
		id: 6,
		name: 'Иерофант',
		description: 'Традиции, духовность, обучение, наставничество',
		img: '05',
	},
	{ id: 7, name: 'Влюблённые', description: 'Любовь, выбор, гармония, отношения', img: '06' },
	{ id: 8, name: 'Колесница', description: 'Победа, решимость, контроль над ситуацией', img: '07' },
	{ id: 9, name: 'Сила', description: 'Мужество, внутренний контроль, сострадание', img: '08' },
	{
		id: 10,
		name: 'Отшельник',
		description: 'Поиск истины, уединение, внутренняя мудрость',
		img: '09',
	},
	{ id: 11, name: 'Колесо Фортуны', description: 'Судьба, перемены, циклы, удача', img: '10' },
	{
		id: 12,
		name: 'Справедливость',
		description: 'Истина, карма, равновесие, ответственность',
		img: '11',
	},
	{ id: 13, name: 'Повешенный', description: 'Пауза, жертва, новое видение, пересмотр', img: '12' },
	{
		id: 14,
		name: 'Смерть',
		description: 'Конец, трансформация, освобождение, обновление',
		img: '13',
	},
	{
		id: 15,
		name: 'Умеренность',
		description: 'Баланс, гармония, терпение, целительство',
		img: '14',
	},
	{
		id: 16,
		name: 'Дьявол',
		description: 'Привязанности, искушение, зависимости, страхи',
		img: '15',
	},
	{ id: 17, name: 'Башня', description: 'Крушение иллюзий, кризис, внезапные перемены', img: '16' },
	{ id: 18, name: 'Звезда', description: 'Надежда, вдохновение, исцеление, вера', img: '17' },
	{ id: 19, name: 'Луна', description: 'Иллюзии, интуиция, страх, тайное', img: '18' },
	{ id: 20, name: 'Солнце', description: 'Радость, успех, энергия, ясность', img: '19' },
	{ id: 21, name: 'Суд', description: 'Пробуждение, прощение, переоценка', img: '20' },
	{ id: 22, name: 'Мир', description: 'Завершение, целостность, достижение, единство', img: '21' },
	{ id: 23, name: 'Туз Жезлов', description: 'Начало дела, вдохновение, энергия', img: '22' },
	{ id: 24, name: 'Двойка Жезлов', description: 'Планирование, решение, стратегия', img: '23' },
	{
		id: 25,
		name: 'Тройка Жезлов',
		description: 'Ожидание результатов, расширение горизонтов',
		img: '24',
	},
	{ id: 26, name: 'Четвёрка Жезлов', description: 'Стабильность, праздник, достижение', img: '25' },
	{ id: 27, name: 'Пятёрка Жезлов', description: 'Конфликт, соревнование, разногласия', img: '26' },
	{ id: 28, name: 'Шестёрка Жезлов', description: 'Победа, признание, успех', img: '27' },
	{ id: 29, name: 'Семёрка Жезлов', description: 'Защита, стойкость, борьба за своё', img: '28' },
	{ id: 30, name: 'Восьмёрка Жезлов', description: 'Скорость, движение, прогресс', img: '29' },
	{
		id: 31,
		name: 'Девятка Жезлов',
		description: 'Настороженность, выносливость, защита',
		img: '30',
	},
	{ id: 32, name: 'Десятка Жезлов', description: 'Бремя, ответственность, перегруз', img: '31' },
	{ id: 33, name: 'Паж Жезлов', description: 'Идеи, энтузиазм, вдохновение', img: '32' },
	{
		id: 34,
		name: 'Рыцарь Жезлов',
		description: 'Приключение, храбрость, стремительность',
		img: '33',
	},
	{ id: 35, name: 'Королева Жезлов', description: 'Харизма, уверенность, страсть', img: '34' },
	{
		id: 36,
		name: 'Король Жезлов',
		description: 'Лидерство, видение, вдохновляющий пример',
		img: '35',
	},
	{ id: 37, name: 'Туз Кубков', description: 'Эмоции, любовь, духовное наполнение', img: '36' },
	{ id: 38, name: 'Двойка Кубков', description: 'Партнёрство, романтика, единение', img: '37' },
	{ id: 39, name: 'Тройка Кубков', description: 'Праздник, дружба, радость', img: '38' },
	{
		id: 40,
		name: 'Четвёрка Кубков',
		description: 'Аппатия, неудовлетворённость, переоценка',
		img: '39',
	},
	{ id: 41, name: 'Пятёрка Кубков', description: 'Потеря, сожаление, грусть', img: '40' },
	{ id: 42, name: 'Шестёрка Кубков', description: 'Ностальгия, воспоминания, детство', img: '41' },
	{
		id: 43,
		name: 'Семёрка Кубков',
		description: 'Фантазии, иллюзии, множественный выбор',
		img: '42',
	},
	{ id: 44, name: 'Восьмёрка Кубков', description: 'Оставление, поиск большего', img: '43' },
	{
		id: 45,
		name: 'Девятка Кубков',
		description: 'Исполнение желаний, удовольствие, комфорт',
		img: '44',
	},
	{
		id: 46,
		name: 'Десятка Кубков',
		description: 'Семейное счастье, гармония, благополучие',
		img: '45',
	},
	{ id: 47, name: 'Паж Кубков', description: 'Творчество, эмоции, воображение', img: '46' },
	{ id: 48, name: 'Рыцарь Кубков', description: 'Романтика, идеализм, предложение', img: '47' },
	{ id: 49, name: 'Королева Кубков', description: 'Сочувствие, интуиция, забота', img: '48' },
	{
		id: 50,
		name: 'Король Кубков',
		description: 'Эмоциональный баланс, зрелость, поддержка',
		img: '49',
	},
	{ id: 51, name: 'Туз Мечей', description: 'Истина, ясность, идея', img: '50' },
	{ id: 52, name: 'Двойка Мечей', description: 'Нерешённость, тупик, равновесие', img: '51' },
	{ id: 53, name: 'Тройка Мечей', description: 'Сердечная боль, предательство, грусть', img: '52' },
	{ id: 54, name: 'Четвёрка Мечей', description: 'Отдых, восстановление, уединение', img: '53' },
	{ id: 55, name: 'Пятёрка Мечей', description: 'Конфликт, поражение, разлад', img: '54' },
	{ id: 56, name: 'Шестёрка Мечей', description: 'Переход, движение к лучшему', img: '55' },
	{ id: 57, name: 'Семёрка Мечей', description: 'Обман, хитрость, стратегия', img: '56' },
	{ id: 58, name: 'Восьмёрка Мечей', description: 'Ограничения, страх, ловушка ума', img: '57' },
	{ id: 59, name: 'Девятка Мечей', description: 'Беспокойство, страх, бессонница', img: '58' },
	{ id: 60, name: 'Десятка Мечей', description: 'Крах, завершение, боль', img: '59' },
	{ id: 61, name: 'Паж Мечей', description: 'Любознательность, правда, слежка', img: '60' },
	{
		id: 62,
		name: 'Рыцарь Мечей',
		description: 'Стремительность, решительность, борьба за истину',
		img: '61',
	},
	{
		id: 63,
		name: 'Королева Мечей',
		description: 'Ясность ума, независимость, честность',
		img: '62',
	},
	{ id: 64, name: 'Король Мечей', description: 'Мудрость, логика, справедливость', img: '63' },
	{
		id: 65,
		name: 'Туз Пентаклей',
		description: 'Материальные возможности, изобилие, новое начинание',
		img: '64',
	},
	{
		id: 66,
		name: 'Двойка Пентаклей',
		description: 'Баланс, адаптация, многозадачность',
		img: '65',
	},
	{
		id: 67,
		name: 'Тройка Пентаклей',
		description: 'Сотрудничество, мастерство, работа в команде',
		img: '66',
	},
	{
		id: 68,
		name: 'Четвёрка Пентаклей',
		description: 'Сохранение, сдержанность, собственничество',
		img: '67',
	},
	{ id: 69, name: 'Пятёрка Пентаклей', description: 'Нужда, утрата, нехватка ресурсов', img: '68' },
	{
		id: 70,
		name: 'Шестёрка Пентаклей',
		description: 'Щедрость, помощь, баланс ресурсов',
		img: '69',
	},
	{ id: 71, name: 'Семёрка Пентаклей', description: 'Ожидание, инвестиции, терпение', img: '70' },
	{ id: 72, name: 'Восьмёрка Пентаклей', description: 'Мастерство, обучение, труд', img: '71' },
	{ id: 73, name: 'Девятка Пентаклей', description: 'Успех, независимость, изобилие', img: '72' },
	{
		id: 74,
		name: 'Десятка Пентаклей',
		description: 'Наследие, богатство, семейные традиции',
		img: '73',
	},
	{ id: 75, name: 'Паж Пентаклей', description: 'Учёба, возможности, исследование', img: '74' },
	{
		id: 76,
		name: 'Рыцарь Пентаклей',
		description: 'Упорство, ответственность, преданность',
		img: '75',
	},
	{
		id: 77,
		name: 'Королева Пентаклей',
		description: 'Практичность, забота, материальное благополучие',
		img: '76',
	},
	{
		id: 78,
		name: 'Король Пентаклей',
		description: 'Стабильность, финансовый успех, щедрость',
		img: '77',
	},
];
let threeCards = [];
let threeCardsNames = '';

const imagePath = (name) => {
	return path.join(__dirname, 'assets', 'cards', `${name}.jpg`);
};
// const imagePath = path.join(__dirname, 'src','assets','cards', `${}.jpg`);
// .map((card) => (card.img = path.join(__dirname, 'src', 'assets', 'cards', `${card.img}.jpg`)));
function shuffled() {
	const shuffledArr = tarotDeck.sort(() => Math.random() - 0.5);
	threeCards = shuffledArr.slice(0, 3);
	threeCardsNames = threeCards.reduce((acc, card) => {
		acc += `${card.name}, `;
		return acc;
	}, '');
}

const app = express();

// парсим json(для того чтобы нода понимала данные из тела запроса)
app.use(express.json());

// разрешаем CORS для фронтенда
app.use(
	cors({
		origin: 'http://localhost:5173',
		credentials: true,
	}),
);
// отдаем статические файлы с картами
app.use('/cardes', express.static(path.join(__dirname, 'assets', 'cards')));

// получаем запрос от фронта с вопросом и сразу отдаем на нейронку
app.post('/', async (req, res) => {
	shuffled();
	const openai = new OpenAI({
		apiKey: process.env.OPENAI_API_KEY,
		baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
	});

	const response = await openai.chat.completions.create({
		model: 'gemini-2.0-flash',
		messages: [
			{ role: 'system', content: 'You are a helpful assistant.' },
			{
				role: 'user',
				content: `представь что ты таролог и дай пояснение  к картам ${threeCardsNames} на вопрос ${req.body.question}`,
			},
		],
	});
	res.send({ message: response.choices[0].message, threeCards });
});

app.listen(3000, () => {
	console.log('Server is running on http://localhost:3000');
});
