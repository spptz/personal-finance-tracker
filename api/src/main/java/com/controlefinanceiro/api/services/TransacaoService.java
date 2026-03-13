package com.controlefinanceiro.api.services;

import com.controlefinanceiro.api.models.Categoria;
import com.controlefinanceiro.api.models.TipoTransacao;
import com.controlefinanceiro.api.models.Transacao;
import com.controlefinanceiro.api.repositories.TransacaoRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

@Service
public class TransacaoService {

    private final TransacaoRepository repository;

    public TransacaoService(TransacaoRepository repository) {
        this.repository = repository;
    }

    public Transacao salvar(Transacao transacao) {
        return repository.save(transacao);
    }

    public BigDecimal calcularSaldo() {
        List<Transacao> todas = repository.findAll();
        BigDecimal saldo = BigDecimal.ZERO;

        for (Transacao t : todas) {
            if (t.getTipo() == TipoTransacao.RECEITA) {
                saldo = saldo.add(t.getValor());
            } else {
                saldo = saldo.subtract(t.getValor());
            }
        }
        return saldo;
    }

    public Map<Categoria, BigDecimal> gerarRelatorioMensal(int mes, int ano) {
        List<Transacao> transacoesDoMes = repository.findByMesEAno(mes, ano);

        // O TreeMap é utilizado aqui para garantir que o relatório gerado
        // sempre mostre as categorias em ordem alfabética.
        Map<Categoria, BigDecimal> relatorio = new TreeMap<>();

        for (Transacao t : transacoesDoMes) {
            BigDecimal valorAtual = relatorio.getOrDefault(t.getCategoria(), BigDecimal.ZERO);
            relatorio.put(t.getCategoria(), valorAtual.add(t.getValor()));
        }

        return relatorio;
    }

    public List<Transacao> listarTodas() {
        return repository.findAll();
    }

    public void excluir(Long id) {
        repository.deleteById(id);
    }
}