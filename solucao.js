var fs = require('fs');
var arquivoNome = process.argv[2];
var parser;
var extensao = identificarExtensao(arquivoNome);
var numeros = lerExtensao(extensao);
var intervalos = instanciarIntervalos(numeros);
escreverIntervalos(intervalos);

function identificarExtensao(arquivoNome){
	var ponto = arquivoNome.lastIndexOf('.');
	var extensao = arquivoNome.substring(ponto+1);
	return extensao;
}
console.log(extensao);
console.log(numeros);
console.log(intervalos);

function lerExtensao(extensao){
	//arquivo csv
	if (extensao == 'csv'){
		var csv = require('csv-string');

		var data = fs.readFileSync("./"+arquivoNome, 'utf8');

    resultado = csv.parse(data);
    var results = [];
    for (var i = 0; i < resultado.length; i++) {
    	results.push(parseInt(resultado[i][0]));
    };
    return results;
	};
	//arquivo xml
	if (extensao == 'xml') {
		var xml = require('xml2js').parseString;

		var arquivo = __dirname + "\\" + arquivoNome;

		var data = fs.readFileSync(arquivo, 'utf-8');
		var results = [];
		xml(data, function(err, resultado){
			for (var i = 0; i < resultado.numeros.numero.length; i++) {
				results.push(parseInt(resultado.numeros.numero[i]['$'].value));
			};
		});
    return results;
	};
	//arquivo json
	if (extensao == 'json') {
		var data = fs.readFileSync("./"+arquivoNome, 'utf8');

		var json = JSON.parse(data);
		var results = [];
		for (var i = 0; i < json.length; i++) {
			results.push(parseInt(json[i]));
		}
		return results;
	};
}
//criaçao de intervalos
function instanciarIntervalos(results){
	var intervalo = [];
	var intervalos = [];
	var primeiro = true;
	for (var i = 0; i < results.length; i++) {
		if(results[i] == results[i+1] - 1){
			if(primeiro){
				intervalo.push(results[i]);
				intervalo.push(results[i+1]);
				primeiro = false;
			}
			else{
				intervalo[1] = results[i+1];
			}
		}

		else{
			if(intervalo[0] != undefined){
				intervalos.push(intervalo);
				intervalo = [];
			}
			else{
				intervalo.push(results[i]);
			}
			primeiro = true;
		}
	};
	intervalos.push(intervalo);
	return intervalos;
}

function escreverIntervalos(intervalos){
	var nomeArquivo = "saida.txt";
	var data = "";
	var separador = "-";
	var separador2 = ", ";
	for (var i = 0; i < intervalos.length; i++) {
		data += intervalos[i][0];
		if(intervalos[i][1] != undefined){
			data += separador + intervalos[i][1];
		}
		data += separador2;
	}
	data = data.substring(0, (data.length - 2));
	fs.writeFileSync(nomeArquivo, data);
	console.log("Arquivo escrito.");
}
