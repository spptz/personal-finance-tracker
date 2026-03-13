package com.controlefinanceiro.api.repositories;

import com.controlefinanceiro.api.models.Transacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TransacaoRepository extends JpaRepository<Transacao, Long> {
    
    // Busca as transações de um mês e ano específicos, já ordenando as categorias alfabeticamente
    @Query("SELECT t FROM Transacao t WHERE MONTH(t.data) = :mes AND YEAR(t.data) = :ano ORDER BY t.categoria ASC")
    List<Transacao> findByMesEAno(@Param("mes") int mes, @Param("ano") int ano);
}