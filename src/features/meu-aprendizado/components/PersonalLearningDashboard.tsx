"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { createBrowserSupabaseClient } from "@shared/lib/supabase/client";
import { isSupabaseConfigured } from "@shared/lib/supabase/config";

import { AccountDeletionButton } from "./AccountDeletionButton";
import { EnrollmentButton } from "./EnrollmentButton";
import {
  buildCompletedLessonSummaries,
  buildStudySummaries,
} from "../services/progresso";
import { loadPersonalLearning } from "../services/repository";
import type {
  LearningCatalog,
  LearningEnrollment,
  LessonCompletion,
  StudySummary,
} from "../types";

export type LearningTab =
  | "resumo"
  | "em-andamento"
  | "concluidos"
  | "aulas-concluidas"
  | "configuracoes";

const tabs: readonly { href: string; id: LearningTab; label: string }[] = [
  { href: "/meu-aprendizado", id: "resumo", label: "Resumo" },
  {
    href: "/meu-aprendizado?tab=em-andamento",
    id: "em-andamento",
    label: "Cursos e trilhas em andamento",
  },
  {
    href: "/meu-aprendizado?tab=concluidos",
    id: "concluidos",
    label: "Cursos e trilhas concluídos",
  },
  {
    href: "/meu-aprendizado?tab=aulas-concluidas",
    id: "aulas-concluidas",
    label: "Aulas concluídas",
  },
  {
    href: "/meu-aprendizado?tab=configuracoes",
    id: "configuracoes",
    label: "Configurações",
  },
];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(
    new Date(value),
  );
}

function StudyList({
  items,
  onEnrollmentChange,
}: Readonly<{
  items: readonly StudySummary[];
  onEnrollmentChange: (item: StudySummary, enrolled: boolean) => void;
}>) {
  if (!items.length) {
    return (
      <div className="learning-empty-state">
        <div className="learning-empty-state__content">
          <p className="status-label">Comece por aqui</p>
          <h3>Nenhum estudo nesta categoria</h3>
          <p>
            Explore cursos e trilhas para iniciar um novo percurso de
            aprendizado.
          </p>
        </div>
        <Link className="button button--secondary" href="/aprendizado">
          Explorar aprendizado
        </Link>
      </div>
    );
  }

  return (
    <ul className="personal-learning-list">
      {items.map((item) => (
        <li key={`${item.type}-${item.identifier}`}>
          <div>
            <p className="status-label">
              {item.type === "curso" ? "Curso" : "Trilha"}
            </p>
            <h3>{item.title}</h3>
            <p>
              {item.progress}% concluído · Atividade em{" "}
              {formatDate(item.lastActivityAt)}
            </p>
            <progress max={100} value={item.progress}>
              {item.progress}%
            </progress>
          </div>
          <div className="personal-study-actions">
            <Link className="button button--secondary" href={item.href}>
              Continuar estudando
            </Link>
            <EnrollmentButton
              contentIdentifier={item.identifier}
              contentType={item.type}
              initialEnrolled
              onEnrollmentChange={(enrolled) =>
                onEnrollmentChange(item, enrolled)
              }
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function PersonalLearningDashboard({
  activeTab,
  catalog,
  loginAction,
}: Readonly<{
  activeTab: LearningTab;
  catalog: LearningCatalog;
  loginAction?: React.ReactNode;
}>) {
  const [status, setStatus] = useState<"loading" | "guest" | "ready" | "error">(
    () => (isSupabaseConfigured() ? "loading" : "guest"),
  );
  const [enrollments, setEnrollments] = useState<LearningEnrollment[]>([]);
  const [completions, setCompletions] = useState<LessonCompletion[]>([]);
  const [userName, setUserName] = useState("Estudante");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();
    if (!supabase) return;

    let mounted = true;
    void (async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!mounted) return;
      if (error || !data.user) {
        setStatus("guest");
        return;
      }

      setUserName(
        String(
          data.user.user_metadata.full_name ??
            data.user.user_metadata.user_name ??
            "Estudante",
        ),
      );

      try {
        const personal = await loadPersonalLearning(supabase, data.user.id);
        if (!mounted) return;
        setEnrollments([...personal.enrollments]);
        setCompletions([...personal.completions]);
        setStatus("ready");
      } catch {
        if (mounted) setStatus("error");
      }
    })();

    return () => {
      mounted = false;
    };
  }, [reloadKey]);

  if (status === "loading") {
    return <p aria-live="polite">Carregando seu aprendizado...</p>;
  }

  if (status === "guest") {
    return (
      <section className="personal-learning-guest">
        <p className="status-label">Meu aprendizado</p>
        <h1>Acompanhe cursos, trilhas e aulas concluídas</h1>
        <p>
          Entre com GitHub para guardar suas inscrições e acompanhar o
          progresso. Todo o conteúdo público continua disponível sem conta.
        </p>
        {loginAction ?? (
          <Link
            className="button button--primary"
            href="/login?next=%2Fmeu-aprendizado"
          >
            Entrar com GitHub
          </Link>
        )}
      </section>
    );
  }

  if (status === "error") {
    return (
      <section className="learning-error-state" role="alert">
        <h1>Não foi possível carregar seu aprendizado</h1>
        <p>Sua sessão pode ter expirado ou o Supabase está indisponível.</p>
        <button
          className="button button--primary"
          onClick={() => {
            setStatus("loading");
            setReloadKey((v) => v + 1);
          }}
          type="button"
        >
          Tentar novamente
        </button>
      </section>
    );
  }

  const studies = buildStudySummaries(enrollments, completions, catalog);
  const completedLessons = buildCompletedLessonSummaries(completions, catalog);
  const inProgress = studies.filter((study) => study.progress < 100);
  const completedStudies = studies.filter((study) => study.progress === 100);
  const handleEnrollmentChange = (item: StudySummary, enrolled: boolean) => {
    if (enrolled) return;
    setEnrollments((current) =>
      current.filter(
        (entry) =>
          entry.content_type !== item.type ||
          entry.content_identifier !== item.identifier,
      ),
    );
  };

  return (
    <div className="personal-learning-page">
      <header className="personal-learning-hero">
        <p className="status-label">Meu aprendizado</p>
        <h1>Olá, {userName}</h1>
        <p>Continue de onde parou ou consulte seu histórico.</p>
      </header>

      <div className="personal-learning-layout">
        <nav
          aria-label="Seções de Meu aprendizado"
          className="personal-learning-nav"
        >
          {tabs.map((tab) => (
            <Link
              aria-current={activeTab === tab.id ? "page" : undefined}
              href={tab.href}
              key={tab.id}
            >
              {tab.label}
            </Link>
          ))}
        </nav>

        <main
          className="personal-learning-content"
          id="personal-learning-content"
          key={activeTab}
        >
          {activeTab === "resumo" ? (
            <>
              <div className="personal-learning-section-heading">
                <div>
                  <p className="status-label">Visão geral</p>
                  <h2>Resumo do seu aprendizado</h2>
                </div>
                <p>Acompanhe seu ritmo e retome de onde parou.</p>
              </div>
              <div className="learning-dashboard-grid">
                <section
                  className="learning-stat-card"
                  aria-labelledby="studies-chart-title"
                >
                  <p className="learning-stat-card__eyebrow">Progresso</p>
                  <h3 id="studies-chart-title">Seus estudos</h3>
                  <div className="learning-chart-summary">
                    <div
                      aria-label={`${inProgress.length} estudos em andamento e ${completedStudies.length} concluídos`}
                      className="learning-donut"
                      role="img"
                      style={{
                        background: `conic-gradient(var(--color-gear-red) 0 ${studies.length ? (completedStudies.length / studies.length) * 360 : 0}deg, var(--color-border) 0 360deg)`,
                      }}
                    >
                      <span aria-hidden="true">
                        {studies.length
                          ? Math.round(
                              (completedStudies.length / studies.length) * 100,
                            )
                          : 0}
                        <small>%</small>
                      </span>
                    </div>
                    <p>
                      <strong>{inProgress.length}</strong> em andamento
                      <span>{completedStudies.length} concluídos</span>
                    </p>
                  </div>
                </section>
                <section className="learning-stat-card">
                  <p className="learning-stat-card__eyebrow">Histórico</p>
                  <h3>Total de aulas concluídas</h3>
                  <div className="learning-total-stat">
                    <strong>{completedLessons.length}</strong>
                    <span>aulas finalizadas</span>
                  </div>
                </section>
              </div>
              <section className="personal-learning-section">
                <h2>Estudos em andamento recentes</h2>
                <StudyList
                  items={inProgress.slice(0, 3)}
                  onEnrollmentChange={handleEnrollmentChange}
                />
              </section>
              <section className="personal-learning-section">
                <p className="status-label">Histórico</p>
                <h2>Aulas concluídas recentes</h2>
                {completedLessons.length ? (
                  <ul className="completed-lessons-list">
                    {completedLessons.slice(0, 2).map((lesson) => (
                      <li key={lesson.identifier}>
                        <Link href={lesson.href}>{lesson.title}</Link>
                        <span>{formatDate(lesson.completedAt)}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>Nenhuma aula concluída ainda.</p>
                )}
              </section>
            </>
          ) : null}

          {activeTab === "em-andamento" ? (
            <>
              <h2>Cursos e trilhas em andamento</h2>
              <StudyList
                items={inProgress}
                onEnrollmentChange={handleEnrollmentChange}
              />
            </>
          ) : null}
          {activeTab === "concluidos" ? (
            <>
              <h2>Cursos e trilhas concluídos</h2>
              <StudyList
                items={completedStudies}
                onEnrollmentChange={handleEnrollmentChange}
              />
            </>
          ) : null}
          {activeTab === "aulas-concluidas" ? (
            <section className="personal-learning-tab-section">
              <h2 className="personal-learning-tab-title">
                Aulas concluídas
              </h2>
              {completedLessons.length ? (
                <ul className="completed-lessons-list">
                  {completedLessons.map((lesson) => (
                    <li key={lesson.identifier}>
                      <Link href={lesson.href}>{lesson.title}</Link>
                      <span>Concluída em {formatDate(lesson.completedAt)}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Nenhuma aula concluída ainda.</p>
              )}
            </section>
          ) : null}
          {activeTab === "configuracoes" ? (
            <section className="personal-learning-settings">
              <header className="personal-learning-settings__heading">
                <p className="status-label">Configurações</p>
                <p>Gerencie os dados e as opções da sua conta.</p>
              </header>
              <AccountDeletionButton />
            </section>
          ) : null}
        </main>
      </div>
    </div>
  );
}
