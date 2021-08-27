const userName = "Fabio" // const define uma vontante
console.log("this is js") // print de mensagens, prints: this is js
let infinityValue = 1/0 
console.log(userName) // prints: Fabio
console.log(infinityValue) // prints: Infinity
console.log(typeof infinityValue) // 1/0=infinito que continua a ser um numero
console.log(`Olá ${userName}`) // usar template strings para incorporar variaveis numa string, prnts: Olá Fabio
const booleano = true // definir boleanos
console.log(booleano) // prints: true
const scroe = null // score é do tipo null
// const z // z será do tipo undefined pode levar ao erro: Missing initializer in const declaration
// uso de tipos não primitivos (objetos)
// os objetos são usados para armazenas coleções de dados e seguem a estrutura "nome:valor"
let person = {
    firstName: "fabio",
    lastName: "Mendonca",
    age: 30
}
console.log(person) // prints: { firstName: 'fabio', lastName: 'Mendonca', age: 30 }
// conversao de number para string
let age_1 = 30
let age_2 = String (age_1) // prints: string
console.log(typeof age_2)
// conversao de string para number
console.log(Number ("    123    ")) // prints: 123
console.log(Number ("casa")) // prints: none
console.log(Number ("")) // prints: 0
console.log(Number (true)) // prints: 1
console.log(Number (false)) // prints: 0
// conversao para booleano
// será false quando: 0, string vazia, undefined, NaN; caso contrario e true
console.log(Boolean ("")) // prints: false
console.log(Boolean (15551448648)) // prints: true
// condição if
let  time = new Date()
if (time.getHours() <= 12){
    console.log("Bom dia, são " + time.getHours() + " horas e " + time.getMinutes() + " minutos")
}
else if (time.getHours() <= 20){
    console.log("Boa tarde")
}
else{
    console.log("Boa noite")
}
// switch
switch (time.getDay()){
    case 0: console.log("Hoje e domingo"); break;
    case 1: console.log("Hoje e segunda"); break;
    case 2: console.log("Hoje e terca"); break;
    case 3: console.log("Hoje e quata"); break;
    case 4: console.log("Hoje e quinta"); break;
    case 5: console.log("Hoje e sexta"); break;
    case 6: console.log("Hoje e sabado"); break;
    default: console.log("Erro"); break;
}
// for loop: usado para repetir umbloco de codigo um determinado numero de vezes
for (let i=0; i<3; i++){
    console.log(i) // se for na consola do browser poder usar (vai exibir caixas de alerta com o valor de "i"): alert(i) 
}
// while loop: usado para repetir um bloco de codigo enquanto a condição for verdadeira
let j = 0
while (j<3){
    console.log(j)
    j++ 
}
// do while loop: usado para repetir um bloco de codigo enquanto a condição for verdadeira mas garantindo que o código é
// executado pelo menos uma vez
let k = 0
do {
    console.log(k)
    k++
} while (k<3)
// sair de um ciclo com break
for (let y = 0; y < 100; y++){
    if (y > 5) break
    console.log(y)
}
// interromper apenas a iteração corrente (saltar alguns dos ciclos)
for (let y = 0; y < 10; y++){
    if (y % 2) continue
    console.log(y)
}
// defenir uma função para somar dois numeros com valoes por defeito a 0
// se os valores por defeito não forem definidos e chamarmos sumaTwoValues sem indicar os valoes de a e b então
// a função vai usar o valor NaN (por exemplo passar sumaTwoValues (4) seria executado 4+NaN=NaN), logo é importante
// definir sempre os valores por defeito
// caso não seja definido return, então a função irá retornar undefined por defeito
function sumaTwoValues (a=0, b=0){ 
    return a+b
}
console.log("A soma é " + sumaTwoValues(1,2))
// variaveis globais podem ser alteradas por funções mas o recomendado é usar só variáveis locais (criadas no interior) das
// funções, se creiarmos uma variável locar com o mesmo nome de uma variável global estas não seão sobrepostas, pelo que
// a manipulação da variável loval não affeta o valor da variável global
var nome = "Fabio"
function shwoMessage(){
    let nome = "Ruben"
    const message = `Nome e ${nome}`
    console.log(message)
}
shwoMessage()
console.log(`Nome e ${nome}`)
// se mudarmos o valor de uma variavel global em uma função ela irá mudar também fora da função
function shwoMessage2(){
    nome = "Ruben"
    const message = `Nome e ${nome}`
    console.log(message)
}
shwoMessage2()
console.log(`Nome e ${nome}`)
// usar a empressão de função (atribuir diretamente o resultado a uma variável) quando queremos criar funções de acordo
// com uma determinada condição:
let ageValue = 20
let greeting
if (ageValue < 18){
    greeting = function(){ // cria uma função anónima (sem nome) e associa a variável greeting
        console.log("Hello")
    }
}
else{
    greeting = function(){
        console.log("Welcome")
    }
}
greeting() // chama a função definida na codição if
// funções arrow são usadas para abreviar a sintac da declaração de funções
// função arrow com uma expressão e sem parametros
let show = () => console.log("Hello there")
show()
// função arrow com uma expressão e um parametro
let show2 = a => console.log(a ** 2)
show2(2)
// função arrow com uma expressão e mais que um parametro
let show3 = (a, b) => console.log((a**2)+b)
show3(2, 1)
// função arrow com mais que uma expressão e mais que um parametro
let show4 = (a, b) => {
    a +=1
    a +=b
    return a
}
console.log(show4(2, 1))
// criação de array (que pode funcionar como fila ou como pilha)
let countries = ["Portugal", "Spain", "France"] // ou para ser um array vazio podemos usar "let countries = []"" ou "let countries = new Array()"
console.log("Tamanho do array e " + countries.length)
// introduzir um elemento na última posição do array usando a posição (indicada em [])
countries[countries.length] = "Italia"
console.log(countries)
// remover um elemento da primeira posição e retornar o element removido
const firstCountry = countries.shift()
console.log("Removeu: " + firstCountry)
console.log(countries)
// adicionar um elemento no inicio do array
const newStart = "MonteNegro"
console.log("Acicionar: " + newStart)
countries.unshift(newStart)
console.log(countries)
// remover um elemento da última posição e retornar o element removido
const lastCountry = countries.pop()
console.log("Removeu: " + lastCountry)
console.log(countries)
// adicionar um elemento no final do array
const newFinal = "Serbia"
console.log("Acicionar: " + newFinal)
countries.push(newFinal)
console.log(countries)
// remover elementos no interior do array
console.log("Remover as entradas 1 e 2 que são: " + countries[1] + " e " + countries[2])
// também podiamos usar "delete countries[1]" e depois "delete countries[2]" mas o delete causa buracos no array
// pois apenas altera o valor para undefined logo o array ficava [ 'MonteNegro', undefined, undefined, 'Serbia' ]
countries.splice(1,2) 
console.log(countries)
// formas de iterar sobre um array:
// ciclo for tradicional (recomendado para ser usado em browsers antigos):
console.log("The countries are:")
for (let i = 0; i < countries.length; i++){
    console.log(countries[i])
}
// ciclo for ... of:
console.log("The countries are:")
for (const county of countries){ // este methodo não dá acesso ao elemento selecionado mas apenas ao seu valor
    console.log(county)
}
// ciclo for ... in (pode ser usado porque arrays são objetos):
console.log("The countries are:")
for (let key in countries){
    console.log(countries[key])
}
// usando o metodo dos arrays:
countries.forEach((item, index, array) => {
    console.log(`${item} esta na posicao ${index} do array "${array}"`)
}
)
// ordenar arrays de strings
countries = ["Portugal", "Italia", "Spain", "France"]
console.log("The countries before sorting are:")
console.log(countries)
console.log("The countries after sorting are:")
countries = countries.sort()
console.log(countries)
console.log("The countries after reverse sorting are:")
countries = countries.reverse()
console.log(countries)
// para ordenar numeros é necessário definir o metodo
// sem o metodo fica
let arrayNumeros = [8, 30, 100, 120, 15]
console.log("The array before sorting is:")
console.log(arrayNumeros)
console.log("The countries after sorting is:")
arrayNumeros = arrayNumeros.sort() // ordena pelo ordem dos numeros logo 100 será visto como menor que 30 porque 1 < 3
console.log(arrayNumeros)
console.log("The countries after sorting with method is:")
function sortCorrect (a, b) {
    return a - b // retorna negativa se a < b, 0 se a == b, e positivo se a > b, depois o sort usa esta referencia para o quicksort ordenar
}
arrayNumeros = arrayNumeros.sort(sortCorrect) 
console.log(arrayNumeros)
// também podemos usar uma função anónima para ordenar sendo o código mias conciso
arrayNumeros = [8, 30, 100, 120, 15]
console.log("The countries after sorting with method 2 is:")
arrayNumeros = arrayNumeros.sort(function (a,b){return a-b}) 
console.log(arrayNumeros)
// para retornar em ordem inversa podemos usar (neste caso com uma função arrow)
arrayNumeros = [8, 30, 100, 120, 15]
console.log("The countries after reverse sorting with method 2 is:")
arrayNumeros = arrayNumeros.sort((a, b) => b - a) 
console.log(arrayNumeros)
// concatenação de arrays
// usando o método convencional
countries = ["Portugal", "Italia", "Spain", "France"]
console.log("First array: " + countries)
otherCountries = ["Germany", "USA"]
console.log("Second array: " + otherCountries)
countriesConcatenated = countries.concat(otherCountries)
console.log("Concatenated array: " + countriesConcatenated)
// usando o operador spread (usar o "...")
otherCountries = [...countries,"Germany", "USA"]
console.log("Concatenated array 2: " + otherCountries)
// pesquisar se um determinado elemento está no array
const pais = "Portugal"
if (countries.includes(pais)){
    console.log(pais + " está no array")
}
else {
    console.log(pais + " não está no array")
}
// pesquisar elementos com determinadas características (neste caso, mais do que 6 characteres)
function isBigEnogh (country){
    return country.length > 6 // retorna true se tiver mais que 6 caracteres
}
const resultsCountries = countriesConcatenated.filter(isBigEnogh)
console.log("Com mais de 6 caracteres: " + resultsCountries)
// usando uma função arrow
const resultsCountriesArrow = countriesConcatenated.filter(country => country.length > 6)
console.log("Com mais de 6 caracteres usando arrow: " + resultsCountriesArrow)
// usar o método map para aplicar uma função a todos os elementos de um array (neste caso para converter
// o primeiro caracter de todas as entradas para minusculo)
let newCountries = countries.map(x => x[0].toLocaleLowerCase() + x.slice(1))
console.log("Paises com minusculas: " + newCountries)
// juntar todos os elementod do array em uma unica string, estando separados por "-"
newCountriesJoint = newCountries.join("-")
console.log("Paises todos juntos: " + newCountriesJoint)
// reduzir a informação de um array, neste caso é um array de numeros que qeremos somar um a um
let arrayNumerosParaSoma = [1, 2, 3, 4, 5]
// soma todos os elementos do array um a um, começando em pelo elemento da posição 0, logo fica
// 1 + 2 = 3, depois 3 + 3 = 6, 6 + 4 = 10, 10 + 5 = 15
const resultSoma = arrayNumerosParaSoma.reduce((soma, valorAtual) => soma + valorAtual, 0)
console.log("Soma de todos os elementos do array: " + resultSoma)
// criação de objetos
let definePerson = {
    name: "Fabio",
    age: 30
}
// alterar uma propriedade do objeto
definePerson.name = "Fabio Mendonca"
console.log(definePerson)
console.log(definePerson.name)
// remover propriedade do objeto
delete definePerson.age
console.log(definePerson)
// adicionar proriedades
definePerson.birth = 20
console.log(definePerson)
// verificar se uma propriedade existe no objeto
console.log("age" in definePerson)
console.log("birth" in definePerson)
// print todoas as propriedades do obejto uma a uma
console.log("Propriedades de definePerson:")
for (let key in definePerson){
    console.log("Key: " + key)
    console.log("Value: " + definePerson[key])
}
// criação de objetos com metodos
let definePersonWithMethod = {
    name: "Fabio",
    age: 30,
    sayHello() {
        console.log(`My name is ${this.name} and my age is ${this.age}`)
    }
}
definePersonWithMethod.sayHello()
// quando compiamos um objeto com "=" estamos a fazer uma copia por referência, logo o objeto pode ser manipulado 
// usando qualqer uma das referências
let definePersonWithMethod2 = definePersonWithMethod
console.log("Objeto definePersonWithMethod2")
console.log(definePersonWithMethod)
definePersonWithMethod2.name = "ABC"
console.log("Objeto definePersonWithMethod2")
console.log(definePersonWithMethod)
// para copiar (clonar) um objeto podemos copiar element a elemento:
let newDefinePersonWithMethod = {}
for (let key in definePersonWithMethod){
    newDefinePersonWithMethod[key] = definePersonWithMethod [key]
}
console.log("Objeto copiado")
console.log(newDefinePersonWithMethod)
newDefinePersonWithMethod.name = "Mia"
console.log("Objeto copiado com novo nome")
console.log(newDefinePersonWithMethod)
console.log("Objeto definePersonWithMethod")
console.log(definePersonWithMethod)
// tambem podemos copiar usando o metodo assign
let newDefinePersonWithMethod2 = Object.assign({}, definePersonWithMethod)
console.log("Objeto copiado")
console.log(newDefinePersonWithMethod2)
newDefinePersonWithMethod2.name = "Mia"
console.log("Objeto copiado com novo nome")
console.log(newDefinePersonWithMethod2)
console.log("Objeto definePersonWithMethod")
console.log(definePersonWithMethod)
// criação de classes para permitir a instanciação de multiplos objetos
// definir o contrutor, os methodos de get e set dos parametros e (neste exemplo) o methdodo
// para comparar dois objetos (metodo static para pertencer a class) de forma a poder ordenalos por idade
class User {
    constructor(name, birthDate){
        this.name = name
        this.birthDate = birthDate
    }
    get name (){
        return this._name
    }
    set name(value){
        if (value.length < 4){
            console.log("Nome muito curto")
        }
        this._name = value
    }
    get birthDate (){
        return this._birthDate
    }
    set birthDate(value){
        this._birthDate = value
    }
    static compare (user1, user2){
        return user1.birthDate - user2.birthDate // retorna negativo se user1 for mais velhor que user 2, retorna 0 se tiverem a mesma idade e 1 caso contrario
    }
}
let nuwUser = new User ("AnaLisa", new Date(1992, 10, 1))
console.log(nuwUser)
console.log("The name of the user is: " + nuwUser.name)
console.log("The birthdate of the user is: " + nuwUser.birthDate)
nuwUser.name = "AnaLisaOliveira"
console.log("The name of the user is: " + nuwUser.name)
console.log(nuwUser)
// cirar multiplos objetos num array
let users = [
    new User ("Maria", new Date(1991, 2, 1)),
    new User ("Liaaaa", new Date(1998, 3, 10)),
    new User ("Siaee", new Date(1980, 9, 5))
]
// ordenar os objetos do array de acordo com a idade usando o return do metodo compare
users.sort(User.compare)
console.log("The sorted list is: ")
for (let i = 0; i < users.length; i++){
    console.log(users[i])
}








/*

// código para executar na consol do browser (não corre no servidor node.js), testando as tês funções de interaçõa:
// alert; prompt; confirm
// usar caixa de alerta que cria uma janela modal (força o utilizador a interagir para poder continuar a interagir
// com a página)
for (let i=0; i<3; i++){
    alert("hello number " + i)
}
// a função promp permit a introdução de dados, exibindo uma janela modal com uma mensagem de texto, um campo para entrada
// de dados e dois botões (ok e cancelar), a função tem dois argumentos, a mensagem a ser mostada e o valor por defeito
// para os dados (neste exemplo é 0),
// caso o utilizador pressione cancelar ou pressione esc o prompt vai retornal null logo não temos de mostrar a mensagem do alert
let nChild = prompt("Quantos filhos tem?", 0)
if (nChild != null) { 
    alert (`Tem ${nChild} filho(s)!`)
}
// a função confirm mostra uma mensagem (normalçmente uma questão) para o utilizador pressionar ok (retorna true) ou 
// cancelar (retorna false)
let removeCliente = confirm ("Deseja mesmo remover o cliente?")
if (removeCliente == true){
    alert("Cliente removido")
}
else {
    alert("Remocao cancelada")
}
// também podemos autoinvocar funções colocando () no fim
(function (){
    console.log("Autoinvoquei-me")
}) ()

*/