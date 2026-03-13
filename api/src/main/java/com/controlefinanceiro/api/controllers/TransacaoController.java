package com.controlefinanceiro.api.controllers;

import com.controlefinanceiro.api.models.Categoria;
import com.controlefinanceiro.api.models.Transacao;
import com.controlefinanceiro.api.services.TransacaoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.math.BigDecimal;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*") // <-- Adicione esta linha!
@RequestMapping("/api/transacoes")
public class TransacaoController {

    private final TransacaoService service;

    public TransacaoController(TransacaoService service) {
        this.service = service;
    }

    // Rota para cadastrar receita ou despesa
    @PostMapping
    public ResponseEntity<Transacao> cadastrar(@Valid @RequestBody Transacao transacao) {
        Transacao novaTransacao = service.salvar(transacao);
        return new ResponseEntity<>(novaTransacao, HttpStatus.CREATED);
    }

    // Rota para mostrar o saldo total
    @GetMapping("/saldo")
    public ResponseEntity<BigDecimal> obterSaldo() {
        return ResponseEntity.ok(service.calcularSaldo());
    }

    // Rota para o relatório mensal por categorias
    @GetMapping("/relatorio")
    public ResponseEntity<Map<Categoria, BigDecimal>> obterRelatorio(
            @RequestParam int mes, 
            @RequestParam int ano) {
        return ResponseEntity.ok(service.gerarRelatorioMensal(mes, ano));
    }

    // Rota para listar todas as transações
    @GetMapping
    public ResponseEntity<List<Transacao>> listarTodas() {
        return ResponseEntity.ok(service.listarTodas());
    }

    // Rota para deletar uma transação pelo ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        service.excluir(id);
        return ResponseEntity.noContent().build(); // Retorna código 204 (Sucesso sem conteúdo)
    }
}