import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import MenuHamburguer from '../../components/MenuHamburguer';
import '../../styles/UserPostClassificationPage.css';

const UserPostClassificationPage = () => {
  const [posts, setPosts] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState({});
  const [modalsOpen, setModalsOpen] = useState({});
  const [message, setMessage] = useState('');
  const [classifiedPosts, setClassifiedPosts] = useState({});
  const [showClassified, setShowClassified] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // --- NOVOS ESTADOS ---
  const [studies, setStudies] = useState([]);
  const [selectedStudyId, setSelectedStudyId] = useState('');

  // 1. Carregar estudos
  const fetchUserStudies = async () => {
    try {
      const res = await api.get('/studies/user');
      const studiesData = Array.isArray(res.data) ? res.data : [];
      setStudies(studiesData);

      if (studiesData.length > 0) {
        setSelectedStudyId(studiesData[0].id);
      }
    } catch (err) {
      console.error('Erro ao buscar estudos do utilizador:', err);
    }
  };

  useEffect(() => {
    fetchUserStudies();
    fetchClassifiedPosts();
  }, []);

  const [expandedImage, setExpandedImage] = useState(null);

  // 2. Disparar busca de posts sempre que o ID do estudo muda
  useEffect(() => {
    if (selectedStudyId) {
      fetchPosts();
    }
  }, [selectedStudyId, classifiedPosts, showClassified]);

  useEffect(() => {
    if (!expandedImage) return;
    const onKey = (e) => e.key === 'Escape' && setExpandedImage(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [expandedImage]);

  const fetchClassifiedPosts = async () => {
    try {
      const res = await api.get('/classifications/user');
      setClassifiedPosts(res.data);
    } catch (err) {
      console.error('Erro ao buscar classificações do utilizador:', err);
    }
  };

  // 3. Buscar posts (filtro studyId)
  const fetchPosts = async () => {
    try {
      console.log(`🚀 [FRONTEND] Pedido API: /posts?studyId=${selectedStudyId}`);
      // Adiciona timestamp
      const res = await api.get(`/posts?studyId=${selectedStudyId}&t=${Date.now()}`);
      
      const allPosts = res.data.posts || [];
      console.log(`📥 [FRONTEND] Recebidos ${allPosts.length} posts.`);

      const filteredPosts = showClassified
        ? allPosts
        : allPosts.filter((post) => {
            const classified = classifiedPosts[post.id];
            if (!post.questions || post.questions.length === 0) return true;
            return !post.questions.every((q) => classified?.[q.id]?.length > 0);
          });
          
      setPosts(filteredPosts);
      
    } catch (err) {
      console.error('Erro ao buscar posts:', err);
    }
  };

  // 4. Mudar estudo e LIMPAR VISUALMENTE
  const handleStudyChange = (e) => {
    const newId = e.target.value;
    console.log(`Mudança de estudo para ID: ${newId}`);
    
    setSelectedStudyId(newId);
    setPosts([]); // Limpa a lista imediatamente
    setCurrentIndex(0); 
  };

  const toggleModal = (questionId) => {
    const currentPost = posts[currentIndex];
    const isOpen = modalsOpen[questionId];

    if (!isOpen) {
      const alreadyClassified = classifiedPosts[currentPost.id]?.[questionId];
      if (alreadyClassified) {
        setSelectedCategories((prev) => ({ ...prev, [questionId]: [...alreadyClassified] }));
      } else {
        setSelectedCategories((prev) => ({ ...prev, [questionId]: [] }));
      }
    } else {
      if (!classifiedPosts[currentPost.id]?.[questionId]) {
        setSelectedCategories((prev) => {
          const updated = { ...prev };
          delete updated[questionId];
          return updated;
        });
      }
    }
    setModalsOpen((prev) => ({ ...prev, [questionId]: !prev[questionId] }));
  };

  const handleCategoryToggle = (questionId, categoryId, type) => {
    setSelectedCategories((prev) => {
      const current = prev[questionId] || [];
      let updated;
      if (type === 'checkbox') {
        updated = current.includes(categoryId)
          ? current.filter((id) => id !== categoryId)
          : [...current, categoryId];
      } else {
        updated = [categoryId];
      }
      return { ...prev, [questionId]: updated };
    });
  };

  const handleSubmit = async (questionId) => {
    const post = posts[currentIndex];
    const selectedForQuestion = selectedCategories[questionId];

    if (!selectedForQuestion || selectedForQuestion.length === 0) {
      setMessage('Seleciona pelo menos uma categoria.');
      return;
    }

    try {
      const allSelected = selectedForQuestion;
      const sentimentoCategoryIds = allSelected.filter((id) => {
        const category = post.questions.flatMap((q) => q.categories).find((c) => c.id === id);
        return category?.categoryType === 'sentimento';
      });

      const payload = {
        postId: post.id,
        questionId,
        categoryIds: allSelected.filter((id) => !sentimentoCategoryIds.includes(id)),
        sentimentoCategoryIds,
      };

      await api.post('/classifications', payload);

      setClassifiedPosts((prev) => {
        const updated = { ...prev };
        if (!updated[post.id]) updated[post.id] = {};
        updated[post.id][questionId] = [...selectedForQuestion];
        return updated;
      });

      setMessage('Classificação enviada com sucesso!');
      setTimeout(() => setMessage(''), 3000);

      setModalsOpen((prev) => ({ ...prev, [questionId]: false }));

      const allAnswered = post.questions.every(
        (q) => (classifiedPosts[post.id]?.[q.id] || (q.id === questionId && selectedForQuestion.length > 0)).length > 0
      );

      if (!showClassified && allAnswered && currentIndex < posts.length - 1) {
        setTimeout(() => {
          setCurrentIndex((prev) => prev + 1);
        }, 800);
      }
    } catch (err) {
      console.error('Erro ao enviar classificação:', err);
      setMessage('Erro ao enviar classificação.');
    }
  };

  const allQuestionsAnswered = () => {
    const post = posts[currentIndex];
    if (!post || !post.questions) return false;
    return post.questions.every((q) => classifiedPosts[post.id]?.[q.id]?.length > 0);
  };

  useEffect(() => {
    if (!showClassified && allQuestionsAnswered() && currentIndex < posts.length - 1) {
      const timeout = setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
      }, 1200);
      return () => clearTimeout(timeout);
    }
  }, [classifiedPosts, currentIndex, posts.length, showClassified]);

  const handlePrev = () => currentIndex > 0 && setCurrentIndex(currentIndex - 1);
  const handleNext = () => currentIndex < posts.length - 1 && setCurrentIndex(currentIndex + 1);

  const currentPost = posts[currentIndex];
  const authorLink = (p) => p?.postLink || p?.pageLink || null;

  return (
    <div className="app-container" style={{ overflowX: 'hidden' }}>
      <MenuHamburguer />
      <div className="main-content">
        <h1>Classificar Post</h1>

        {/* --- SELECT BOX DE ESTUDOS --- */}
        <div style={{ marginBottom: '20px', padding: '15px', background: '#f5f5f5', borderRadius: '8px', border: '1px solid #ddd' }}>
            <label style={{ fontWeight: 'bold', marginRight: '10px', fontSize: '1.1rem' }}>
                Selecionar Estudo:
            </label>
            <select 
                value={selectedStudyId} 
                onChange={handleStudyChange}
                style={{ padding: '8px', fontSize: '1rem', borderRadius: '5px', minWidth: '250px', cursor: 'pointer' }}
            >
                {studies.length === 0 ? (
                    <option value="">A carregar estudos...</option>
                ) : (
                    studies.map(study => (
                        <option key={study.id} value={study.id}>
                            {study.name}
                        </option>
                    ))
                )}
            </select>
        </div>

        <label>
          <input type="checkbox" checked={showClassified} onChange={() => setShowClassified(!showClassified)} />{' '}
          Mostrar posts já classificados
        </label>

        {currentPost ? (
          <div className="post-card">
            <div className="byline">
              <strong>Autor:</strong>{' '}
              {authorLink(currentPost) ? (
                <a href={authorLink(currentPost)} target="_blank" rel="noreferrer">
                  {currentPost.pageName}
                </a>
              ) : (
                currentPost.pageName
              )}
              {currentPost.socialName ? <span className="social-chip">{currentPost.socialName}</span> : null}
            </div>

            {currentPost.images?.length > 0 ? (
              <img
                src={`data:image/jpeg;base64,${currentPost.images[0].image_data}`}
                alt="Post"
                className="post-image clickable"
                onClick={() => setExpandedImage(currentPost.images[0].image_data)}
              />
            ) : (
              <p className="no-image">Este post não contém imagem.</p>
            )}

            <p className="post-text">
              <strong>Texto:</strong> {currentPost.details}
            </p>

            <div className="post-interactions">
              <span>👍 {currentPost.likesCount}</span>
              <span>💬 {currentPost.commentsCount}</span>
              <span>🔁 {currentPost.sharesCount}</span>
            </div>

            {currentPost.questions.map((question) => (
              <div key={question.id} className="question-block">
                <span className="question-label">Questão:</span>
                <button className="open-modal-btn" onClick={() => toggleModal(question.id)}>
                  {question.question}
                </button>
                {classifiedPosts[currentPost.id]?.[question.id]?.length > 0 && (
                  <span className="answered">✅ Respondida</span>
                )}

                {modalsOpen[question.id] && (
                  <div className="modal-backdrop" onClick={() => toggleModal(question.id)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                      <h3>Questão: {question.question}</h3>
                      <div className="category-options">
                        {question.categories.map((cat) => (
                          <label key={cat.id}>
                            <input
                              type={question.inputType}
                              name={question.inputType === 'radio' ? `q-${question.id}` : undefined}
                              checked={(selectedCategories[question.id] || []).includes(cat.id)}
                              onChange={() => handleCategoryToggle(question.id, cat.id, question.inputType)}
                            />
                            {cat.name}
                          </label>
                        ))}
                      </div>
                      <div className="modal-actions">
                        <button className="close-btn" onClick={() => toggleModal(question.id)}>
                          Fechar
                        </button>
                        <button className="modal-submit-btn" onClick={() => handleSubmit(question.id)}>
                          Submeter Classificação
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {message && <p className="message">{message}</p>}

            <div className="carousel-nav">
              <button onClick={handlePrev} disabled={currentIndex === 0}>
                ← Anterior
              </button>
              <button onClick={handleNext} disabled={currentIndex === posts.length - 1}>
                Seguinte →
              </button>
            </div>
          </div>
        ) : (
          <p style={{ marginTop: '20px', fontSize: '1.1rem', color: '#555' }}>
            {selectedStudyId 
             ? "Nenhum post disponível para classificar neste estudo." 
             : "A carregar..."}
          </p>
        )}

        {expandedImage && (
          <div className="img-backdrop" onClick={() => setExpandedImage(null)}>
            <div className="img-modal" onClick={(e) => e.stopPropagation()}>
              <button className="img-close" onClick={() => setExpandedImage(null)} aria-label="Fechar">
                ×
              </button>
              <img src={`data:image/jpeg;base64,${expandedImage}`} alt="Imagem expandida" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserPostClassificationPage;