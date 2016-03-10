/*
  Another utils
*/

module.exports = {
  /*
    Produce a quite acceptable lucene query from a natural query search.
  'ciao "mamma°bella" ciao'.replace(/("?)\s("?)/g, function(m, a ,b) { console.log(m, 'a:',typeof a,a.length,'- b:',typeof b, b.length); return 'SPACE'})
    for each field
    in order to avoid parser exception
  */
  toLucene: function(query, field) {
    //excape chars + - && || ! ( ) { } [ ] ^ " ~ * ? : \
    // replace query
    var Q = '(:D)',
        S = '[-_°]',
        q;
    // transform /ciao "mamma bella" ciao/ in 
    // /ciao (:-)mamma[-_°]bella(:-) ciao/
    // note that it transform only COUPLES
    q = query.replace(/"[^"]*"/g, function (m) {
      return m.split(/\s/).join(S).replace(/"/g, Q)
    });

    // delete all the remaining " chars
    q = q.split('"').join('');
    
    // transform spaces from /ciao "mamma[-_°]bella" ciao/
    // to a list of ["ciao", ""mamma[-_°]bella"", "ciao"]
    // then JOIN with OR operator
    q = q.split(/\s/).filter(function (d){
      return d.trim().length > 1
    });

    q = q.map(function (d) {
      // has BOTH matches of Q?
      var l = [field, ':'];
      if(d.indexOf(Q) === -1)
        l.push('*', d, '*')
      else
        l.push('"', d, '"')
      return l.join('').split(Q).join('')
    }).join(' AND ').split(S).join(' ');
    return q;
  
  },
  /**
    Neo4j Chypher filter query parser. REplace the {?<neo4jVariableName>}
    with proper WHERE chain.
  */
  agentBrown: function(cypherQuery, filters) {
    var _concatenate = false,
        methods = {
          lt: '<=',
          gt: '>=',
          slt: '<', 
          sgt: '>',
          equals: '=',
          differs: '<>',
          pattern: '=~', // MUST be replaced by a neo4j valid regexp.
          in: 'IN',
          ID: 'id(node) =',
          inID: 'id(node) IN'
        };
    
    return cypherQuery
        .replace(/[\n\r]/g, ' ')
        .replace(/\{if:([a-zA-Z_]+)\}((?:(?!\{\/if).)*)\{\/if\}/g, function (m, item, contents) {
          // replace if template.
          // console.log(arguments)
          if(typeof filters[item] != 'undefined')
            return module.exports.agentBrown(contents, filters);
          else 
            return '';
        })
        .replace(/\{unless:([a-zA-Z_]+)\}((?:(?!\{\/unless).)*)\{\/unless\}/g, function (m, item, contents) {
          // replace unless template.
          // console.log(arguments)
          if(typeof filters[item] == 'undefined')
            return module.exports.agentBrown(contents, filters);
          else 
            return '';
        })
        .replace(/\{each:([a-zA-Z_]+)\sin\s([a-zA-Z_]+)\}((?:(?!\{\/each).)*)\{\/each\}/g, function (m, item, collection, contents) {
          // replace loop {each:language in languages} {:title_%(language)} = {{:title_%(language)}} {/each} with join.
          // produce something like
          // title_en = {title_en}, title_fr = {title_fr}
          // which should be cypher compatible.
          // This function call recursively agentBrown() 
          var template = [];
          for(var i in filters[collection]) {
            var f = {};
            f[item] = filters[collection][i];
            template.push(module.exports.agentBrown(contents, f));
          }
          return template.join(', ');
        })
        .replace(/\{:([a-z_A-Z]+)\}/g, function (m, placeholder) {
          // replace dynamic variables (used for label)
          // e.g. `MATCH (ent:{:type})` becomes `MATCH (ent:person)` if type = 'person'
          return filters[placeholder]
        })
        .replace(/\{:([a-z_A-Z%\(\)\s]+)\}/g, function (m, placeholder) {
          // replace dynamic variables, e.g to write ent.title_en WHERE 'en' is dynaically assigned,
          // write as query
          // ent.{:title_%(language) % language}
          // and provide the filters with language
          return placeholder.replace(/%\(([a-z_A-Z]+)\)/g, function (m, property) {
            return filters[property]
          });
        })
        .replace(/\{(AND|OR)?\?([a-z_A-Z]+):([a-z_A-Z]+)__([a-z_A-Z]+)\}/g, function (m, operand, node, property, method) {
          // replace WHERE clauses
          var chunk = '',
              segments = [
                node + '.' + property,
                methods[method],
                '{' + property + '}'//filters[property]
              ];
          
          if(!methods[method])
            throw method + ' method is not available supported method, choose between ' + JSON.stringify(methods);
            
          if(!filters[property])
            return '';
          
          if(method == 'ID' || method == 'inID')
            segments = [methods[method].replace('node', node), '{'+property+'}'];
          
          if(_concatenate && operand == undefined)
            _concatenate = false; // start with WHERE
          
          
          if(!_concatenate)
            chunk = ['WHERE'].concat(segments).join(' ') 
          else 
            chunk = [operand].concat(segments).join(' ');
          
          _concatenate = true;
          return chunk;
        })
  },
};